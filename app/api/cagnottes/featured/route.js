import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Récupérer les 3 cagnottes les plus récentes et actives pour la section "en vedette"
    // On peut aussi utiliser d'autres critères comme le montant collecté, le nombre de participants, etc.
    const result = await client.query(
      `SELECT 
        id, 
        user_id, 
        title, 
        custom_url, 
        category, 
        description, 
        images, 
        video, 
        is_private, 
        show_target, 
        target_amount, 
        hide_amount, 
        show_participants, 
        current_amount, 
        participants_count,
        status, 
        created_at, 
        updated_at,
        author_name
      FROM cagnottes 
      WHERE is_private = false 
        AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 3`
    );
    
    client.release();

    // Parser les images pour chaque cagnotte
    const cagnottes = result.rows.map(cagnotte => {
      if (cagnotte.images && typeof cagnotte.images === 'string') {
        try {
          cagnotte.images = JSON.parse(cagnotte.images);
        } catch (parseError) {
          console.error('Erreur de parsing JSON pour les images (cagnottes en vedette):', parseError, 'pour cagnotte ID:', cagnotte.id);
          cagnotte.images = []; // Valeur par défaut
        }
      }
      return cagnotte;
    });

    return NextResponse.json(cagnottes, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des cagnottes en vedette:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur lors de la récupération des cagnottes en vedette.' 
    }, { status: 500 });
  }
}
