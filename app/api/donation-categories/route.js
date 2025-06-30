import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Récupérer les catégories de dons
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'service', 'material', 'skill'
  const isActive = searchParams.get('active') !== 'false'; // Par défaut true

  try {
    const client = await pool.connect();
    
    let query = `
      SELECT id, type, name, description, icon, is_active, created_at, updated_at
      FROM donation_categories
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (isActive) {
      query += ` AND is_active = $${paramIndex}`;
      queryParams.push(true);
      paramIndex++;
    }

    query += ` ORDER BY type, name`;

    const result = await client.query(query, queryParams);
    client.release();

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

// POST - Créer une nouvelle catégorie (admin seulement)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, description, icon } = body;

    // Validation des données
    if (!type || !name) {
      return NextResponse.json({
        success: false,
        error: 'Le type et le nom sont requis'
      }, { status: 400 });
    }

    if (!['service', 'material', 'skill'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Type invalide. Doit être: service, material ou skill'
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier si la catégorie existe déjà
    const existingResult = await client.query(
      'SELECT id FROM donation_categories WHERE type = $1 AND name = $2',
      [type, name]
    );

    if (existingResult.rows.length > 0) {
      client.release();
      return NextResponse.json({
        success: false,
        error: 'Cette catégorie existe déjà'
      }, { status: 409 });
    }

    // Créer la nouvelle catégorie
    const result = await client.query(
      `INSERT INTO donation_categories (type, name, description, icon)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [type, name, description || null, icon || null]
    );

    client.release();

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Catégorie créée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}
