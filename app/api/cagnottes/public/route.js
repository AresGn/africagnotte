import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, user_id, title, custom_url, category, description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, status, created_at, updated_at FROM cagnottes WHERE is_private = false ORDER BY created_at DESC"
    );
    client.release();

    // Parser les images pour chaque cagnotte
    const cagnottes = result.rows.map(cagnotte => {
      if (cagnotte.images && typeof cagnotte.images === 'string') {
        try {
          cagnotte.images = JSON.parse(cagnotte.images);
        } catch (parseError) {
          console.error('Erreur de parsing JSON pour les images (liste publique):', parseError, 'pour cagnotte ID:', cagnotte.id);
          cagnotte.images = []; // Ou une valeur par défaut appropriée
        }
      }
      return cagnotte;
    });

    return NextResponse.json(cagnottes, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des cagnottes publiques:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la récupération des cagnottes publiques.' }, { status: 500 });
  }
} 