import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du témoignage requis' 
        },
        { status: 400 }
      );
    }

    const result = await pool.query(`
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
        cagnotte_id,
        created_at,
        updated_at
      FROM testimonials 
      WHERE id = $1 AND is_published = true
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Témoignage non trouvé' 
        },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    // Formater les données pour le frontend
    const testimonial = {
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
      cagnotteId: row.cagnotte_id,
      date: row.created_at.toISOString().split('T')[0],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    return NextResponse.json({
      success: true,
      data: testimonial
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération du témoignage' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du témoignage requis' 
        },
        { status: 400 }
      );
    }

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
      isFeatured,
      isPublished
    } = body;

    const result = await pool.query(`
      UPDATE testimonials SET
        name = COALESCE($2, name),
        age = COALESCE($3, age),
        location = COALESCE($4, location),
        story = COALESCE($5, story),
        short_description = COALESCE($6, short_description),
        main_image = COALESCE($7, main_image),
        before_image = COALESCE($8, before_image),
        after_image = COALESCE($9, after_image),
        video_url = COALESCE($10, video_url),
        additional_images = COALESCE($11, additional_images),
        amount_raised = COALESCE($12, amount_raised),
        donors_count = COALESCE($13, donors_count),
        category = COALESCE($14, category),
        impact = COALESCE($15, impact),
        is_featured = COALESCE($16, is_featured),
        is_published = COALESCE($17, is_published),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      id,
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
      isFeatured,
      isPublished
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Témoignage non trouvé' 
        },
        { status: 404 }
      );
    }

    const updatedTestimonial = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: updatedTestimonial.id,
        name: updatedTestimonial.name,
        age: updatedTestimonial.age,
        location: updatedTestimonial.location,
        story: updatedTestimonial.story,
        shortDescription: updatedTestimonial.short_description,
        image: updatedTestimonial.main_image,
        beforeImage: updatedTestimonial.before_image,
        afterImage: updatedTestimonial.after_image,
        video: updatedTestimonial.video_url,
        additionalImages: updatedTestimonial.additional_images || [],
        amountRaised: parseFloat(updatedTestimonial.amount_raised),
        donorsCount: updatedTestimonial.donors_count,
        category: updatedTestimonial.category,
        impact: updatedTestimonial.impact || [],
        isFeatured: updatedTestimonial.is_featured,
        date: updatedTestimonial.created_at.toISOString().split('T')[0],
        createdAt: updatedTestimonial.created_at,
        updatedAt: updatedTestimonial.updated_at
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour du témoignage' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du témoignage requis' 
        },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      DELETE FROM testimonials 
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Témoignage non trouvé' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Témoignage supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du témoignage:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression du témoignage' 
      },
      { status: 500 }
    );
  }
}
