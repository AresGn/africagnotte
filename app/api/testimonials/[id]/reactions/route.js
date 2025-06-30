import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fonction pour obtenir l'empreinte du client
function getClientFingerprint(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  
  // Créer une empreinte simple basée sur les headers
  const fingerprint = Buffer.from(`${userAgent}${acceptLanguage}${acceptEncoding}`).toString('base64');
  return fingerprint.substring(0, 255); // Limiter la taille
}

// Fonction pour obtenir l'IP du client
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return '127.0.0.1'; // Fallback
}

// GET - Récupérer les réactions d'un témoignage
export async function GET(request, { params }) {
  const testimonialId = (await params).id;

  if (!testimonialId) {
    return NextResponse.json({
      success: false,
      error: 'ID du témoignage requis'
    }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    
    // Récupérer les compteurs de réactions
    const result = await client.query(
      `SELECT 
        likes_count, hearts_count, support_count, inspire_count, total_reactions
       FROM testimonials 
       WHERE id = $1`,
      [testimonialId]
    );

    if (result.rows.length === 0) {
      client.release();
      return NextResponse.json({
        success: false,
        error: 'Témoignage introuvable'
      }, { status: 404 });
    }

    const testimonial = result.rows[0];
    
    // Vérifier si l'utilisateur actuel a déjà réagi
    const clientIP = getClientIP(request);
    const clientFingerprint = getClientFingerprint(request);
    
    const userReactionResult = await client.query(
      `SELECT reaction_type FROM testimonial_reactions 
       WHERE testimonial_id = $1 AND user_ip = $2 AND user_fingerprint = $3`,
      [testimonialId, clientIP, clientFingerprint]
    );

    client.release();

    return NextResponse.json({
      success: true,
      data: {
        testimonialId,
        reactions: {
          likes: testimonial.likes_count || 0,
          hearts: testimonial.hearts_count || 0,
          support: testimonial.support_count || 0,
          inspire: testimonial.inspire_count || 0,
          total: testimonial.total_reactions || 0
        },
        userReaction: userReactionResult.rows.length > 0 ? userReactionResult.rows[0].reaction_type : null
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réactions:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// POST - Ajouter ou modifier une réaction
export async function POST(request, { params }) {
  const testimonialId = (await params).id;

  if (!testimonialId) {
    return NextResponse.json({
      success: false,
      error: 'ID du témoignage requis'
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { reactionType } = body;

    // Validation du type de réaction
    const validReactions = ['like', 'heart', 'support', 'inspire'];
    if (!reactionType || !validReactions.includes(reactionType)) {
      return NextResponse.json({
        success: false,
        error: 'Type de réaction invalide. Doit être: like, heart, support ou inspire'
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que le témoignage existe
    const testimonialResult = await client.query(
      'SELECT id FROM testimonials WHERE id = $1',
      [testimonialId]
    );

    if (testimonialResult.rows.length === 0) {
      client.release();
      return NextResponse.json({
        success: false,
        error: 'Témoignage introuvable'
      }, { status: 404 });
    }

    const clientIP = getClientIP(request);
    const clientFingerprint = getClientFingerprint(request);

    // Vérifier si l'utilisateur a déjà réagi
    const existingReactionResult = await client.query(
      `SELECT id, reaction_type FROM testimonial_reactions 
       WHERE testimonial_id = $1 AND user_ip = $2 AND user_fingerprint = $3`,
      [testimonialId, clientIP, clientFingerprint]
    );

    let result;
    let message;

    if (existingReactionResult.rows.length > 0) {
      const existingReaction = existingReactionResult.rows[0];
      
      if (existingReaction.reaction_type === reactionType) {
        // Supprimer la réaction si c'est la même
        await client.query(
          'DELETE FROM testimonial_reactions WHERE id = $1',
          [existingReaction.id]
        );
        message = 'Réaction supprimée';
      } else {
        // Modifier la réaction
        result = await client.query(
          `UPDATE testimonial_reactions 
           SET reaction_type = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [reactionType, existingReaction.id]
        );
        message = 'Réaction modifiée';
      }
    } else {
      // Ajouter une nouvelle réaction
      result = await client.query(
        `INSERT INTO testimonial_reactions (testimonial_id, user_ip, user_fingerprint, reaction_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [testimonialId, clientIP, clientFingerprint, reactionType]
      );
      message = 'Réaction ajoutée';
    }

    // Récupérer les nouveaux compteurs
    const updatedCountsResult = await client.query(
      `SELECT 
        likes_count, hearts_count, support_count, inspire_count, total_reactions
       FROM testimonials 
       WHERE id = $1`,
      [testimonialId]
    );

    client.release();

    const updatedCounts = updatedCountsResult.rows[0];

    return NextResponse.json({
      success: true,
      message,
      data: {
        testimonialId,
        reactions: {
          likes: updatedCounts.likes_count || 0,
          hearts: updatedCounts.hearts_count || 0,
          support: updatedCounts.support_count || 0,
          inspire: updatedCounts.inspire_count || 0,
          total: updatedCounts.total_reactions || 0
        },
        userReaction: result && result.rows.length > 0 ? result.rows[0].reaction_type : null
      }
    });

  } catch (error) {
    console.error('Erreur lors de la gestion de la réaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
