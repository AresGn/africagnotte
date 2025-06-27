import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuration pour Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');

    let query = `
      SELECT 
        id,
        name,
        age,
        location,
        story,
        short_description,
        main_image,
        before_image,
        after_image,
        video_url,
        additional_images,
        amount_raised,
        donors_count,
        category,
        impact,
        is_featured,
        created_at,
        updated_at
      FROM testimonials 
      WHERE is_published = true
    `;

    const queryParams: (string | number | boolean)[] = [];
    let paramIndex = 1;

    // Filtrer par featured si spécifié
    if (featured === 'true') {
      query += ` AND is_featured = $${paramIndex}`;
      queryParams.push(true);
      paramIndex++;
    }

    // Filtrer par catégorie si spécifiée
    if (category) {
      query += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // Ordonner par date de création (plus récent en premier)
    query += ` ORDER BY created_at DESC`;

    // Limiter le nombre de résultats si spécifié
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(parseInt(limit));
    }

    const result = await pool.query(query, queryParams);

    // Formater les données pour le frontend
    const testimonials = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      age: row.age,
      location: row.location,
      story: row.story,
      shortDescription: row.short_description,
      image: row.main_image,
      beforeImage: row.before_image,
      afterImage: row.after_image,
      video: row.video_url,
      additionalImages: row.additional_images || [],
      amountRaised: parseFloat(row.amount_raised),
      donorsCount: row.donors_count,
      category: row.category,
      impact: row.impact || [],
      isFeatured: row.is_featured,
      date: row.created_at.toISOString().split('T')[0],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des témoignages' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      age,
      location,
      story,
      shortDescription,
      mainImage,
      beforeImage,
      afterImage,
      videoUrl,
      additionalImages,
      amountRaised,
      donorsCount,
      category,
      impact,
      isFeatured = false,
      cagnotteId
    } = body;

    // Validation des champs requis
    if (!name || !location || !story || !shortDescription || !mainImage || !category || !impact) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Champs requis manquants' 
        },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      INSERT INTO testimonials (
        name, age, location, story, short_description, main_image,
        before_image, after_image, video_url, additional_images,
        amount_raised, donors_count, category, impact, is_featured, cagnotte_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      name,
      age,
      location,
      story,
      shortDescription,
      mainImage,
      beforeImage,
      afterImage,
      videoUrl,
      additionalImages || [],
      amountRaised || 0,
      donorsCount || 0,
      category,
      impact,
      isFeatured,
      cagnotteId
    ]);

    const newTestimonial = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: newTestimonial.id,
        name: newTestimonial.name,
        age: newTestimonial.age,
        location: newTestimonial.location,
        story: newTestimonial.story,
        shortDescription: newTestimonial.short_description,
        image: newTestimonial.main_image,
        beforeImage: newTestimonial.before_image,
        afterImage: newTestimonial.after_image,
        video: newTestimonial.video_url,
        additionalImages: newTestimonial.additional_images || [],
        amountRaised: parseFloat(newTestimonial.amount_raised),
        donorsCount: newTestimonial.donors_count,
        category: newTestimonial.category,
        impact: newTestimonial.impact || [],
        isFeatured: newTestimonial.is_featured,
        date: newTestimonial.created_at.toISOString().split('T')[0],
        createdAt: newTestimonial.created_at,
        updatedAt: newTestimonial.updated_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création du témoignage' 
      },
      { status: 500 }
    );
  }
}
