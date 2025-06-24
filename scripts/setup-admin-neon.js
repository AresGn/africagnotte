const { Pool } = require('pg');
require('dotenv').config();

// Configuration pour Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Commandes SQL à exécuter une par une
const sqlCommands = [
  {
    name: "Créer le type enum user_role",
    sql: `DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');
    EXCEPTION
      WHEN duplicate_object THEN 
        RAISE NOTICE 'Le type user_role existe déjà';
    END $$;`
  },
  {
    name: "Ajouter la colonne role",
    sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20);`
  },
  {
    name: "Mettre à jour les valeurs NULL",
    sql: `UPDATE profiles SET role = 'user' WHERE role IS NULL;`
  },
  {
    name: "Convertir role vers enum",
    sql: `ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;`
  },
  {
    name: "Ajouter valeur par défaut pour role",
    sql: `ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;`
  },
  {
    name: "Créer le type enum moderation_status",
    sql: `DO $$ BEGIN
      CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
    EXCEPTION
      WHEN duplicate_object THEN 
        RAISE NOTICE 'Le type moderation_status existe déjà';
    END $$;`
  },
  {
    name: "Créer table moderation_actions",
    sql: `CREATE TABLE IF NOT EXISTS moderation_actions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      cagnotte_id UUID REFERENCES cagnottes(id) ON DELETE CASCADE,
      moderator_id UUID REFERENCES profiles(id),
      action VARCHAR(20) NOT NULL,
      reason TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );`
  },
  {
    name: "Créer table reports",
    sql: `CREATE TABLE IF NOT EXISTS reports (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      cagnotte_id UUID REFERENCES cagnottes(id) ON DELETE CASCADE,
      reporter_id UUID REFERENCES profiles(id),
      reason VARCHAR(20) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      reviewed_by UUID REFERENCES profiles(id),
      reviewed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );`
  },
  {
    name: "Ajouter colonne moderation_status à cagnottes",
    sql: `ALTER TABLE cagnottes ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(20);`
  },
  {
    name: "Ajouter autres colonnes de modération",
    sql: `ALTER TABLE cagnottes ADD COLUMN IF NOT EXISTS moderation_notes TEXT,
          ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES profiles(id),
          ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;`
  },
  {
    name: "Mettre à jour moderation_status NULL",
    sql: `UPDATE cagnottes SET moderation_status = 'approved' WHERE moderation_status IS NULL;`
  },
  {
    name: "Convertir moderation_status vers enum",
    sql: `ALTER TABLE cagnottes ALTER COLUMN moderation_status TYPE moderation_status USING moderation_status::moderation_status;`
  },
  {
    name: "Ajouter valeur par défaut moderation_status",
    sql: `ALTER TABLE cagnottes ALTER COLUMN moderation_status SET DEFAULT 'pending'::moderation_status;`
  },
  {
    name: "Créer les index",
    sql: `CREATE INDEX IF NOT EXISTS idx_cagnottes_moderation_status ON cagnottes(moderation_status);
          CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
          CREATE INDEX IF NOT EXISTS idx_moderation_actions_cagnotte ON moderation_actions(cagnotte_id);
          CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);`
  },
  {
    name: "Ajouter contraintes de validation",
    sql: `ALTER TABLE reports ADD CONSTRAINT IF NOT EXISTS check_report_reason 
            CHECK (reason IN ('fraud', 'inappropriate', 'spam', 'other'));
          ALTER TABLE reports ADD CONSTRAINT IF NOT EXISTS check_report_status 
            CHECK (status IN ('pending', 'reviewed', 'resolved'));
          ALTER TABLE moderation_actions ADD CONSTRAINT IF NOT EXISTS check_moderation_action 
            CHECK (action IN ('approve', 'reject', 'suspend', 'request_info'));`
  },
  {
    name: "Créer fonction get_admin_stats",
    sql: `CREATE OR REPLACE FUNCTION get_admin_stats()
    RETURNS JSON AS $$
    DECLARE
        result JSON;
    BEGIN
        SELECT json_build_object(
            'total_cagnottes', (SELECT COUNT(*) FROM cagnottes),
            'pending_cagnottes', (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'pending'),
            'approved_cagnottes', (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'approved'),
            'rejected_cagnottes', (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'rejected'),
            'suspended_cagnottes', (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'suspended'),
            'total_users', (SELECT COUNT(*) FROM profiles),
            'pending_reports', (SELECT COUNT(*) FROM reports WHERE status = 'pending'),
            'total_reports', (SELECT COUNT(*) FROM reports)
        ) INTO result;
        
        RETURN result;
    END;
    $$ LANGUAGE plpgsql;`
  },
  {
    name: "Créer vue admin_cagnottes_view",
    sql: `CREATE OR REPLACE VIEW admin_cagnottes_view AS
    SELECT 
        c.*,
        COALESCE(p.first_name || ' ' || p.last_name, p.email) as creator_name,
        p.email as creator_email,
        COALESCE(mod_p.first_name || ' ' || mod_p.last_name, mod_p.email) as moderator_name,
        (SELECT COUNT(*) FROM reports WHERE cagnotte_id = c.id) as reports_count
    FROM cagnottes c
    LEFT JOIN profiles p ON c.user_id = p.id
    LEFT JOIN profiles mod_p ON c.moderated_by = mod_p.id;`
  }
];

async function setupAdminOnNeon() {
  console.log('🚀 Configuration du dashboard admin sur Neon...\n');
  
  let successCount = 0;
  let errorCount = 0;

  try {
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      console.log(`📝 Étape ${i + 1}/${sqlCommands.length}: ${command.name}`);
      
      try {
        await pool.query(command.sql);
        console.log(`✅ Succès\n`);
        successCount++;
      } catch (error) {
        console.log(`❌ Erreur: ${error.message}\n`);
        errorCount++;
        
        // Continuer même en cas d'erreur (certaines peuvent être normales)
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate_object') ||
            error.message.includes('IF NOT EXISTS')) {
          console.log(`ℹ️  Cette erreur est probablement normale (objet existant)\n`);
        }
      }
    }

    // Vérifications finales
    console.log('🔍 Vérifications finales...');
    
    // Vérifier les tables créées
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('moderation_actions', 'reports')
    `);
    console.log(`📋 Tables créées: ${tablesResult.rows.map(r => r.table_name).join(', ')}`);

    // Vérifier les colonnes ajoutées
    const columnsResult = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cagnottes' 
      AND column_name IN ('moderation_status', 'moderation_notes', 'moderated_by', 'moderated_at')
    `);
    console.log(`🔧 Colonnes ajoutées: ${columnsResult.rows.map(r => r.column_name).join(', ')}`);

    // Vérifier les types enum
    const enumsResult = await pool.query(`
      SELECT typname FROM pg_type 
      WHERE typname IN ('user_role', 'moderation_status')
    `);
    console.log(`🏷️  Types enum créés: ${enumsResult.rows.map(r => r.typname).join(', ')}`);

    console.log(`\n🎯 Résumé:`);
    console.log(`✅ Succès: ${successCount}/${sqlCommands.length}`);
    console.log(`❌ Erreurs: ${errorCount}/${sqlCommands.length}`);
    
    console.log(`\n📋 Prochaines étapes:`);
    console.log(`1. Créer votre utilisateur admin:`);
    console.log(`   UPDATE profiles SET role = 'super_admin' WHERE email = 'votre-email@example.com';`);
    console.log(`2. Tester le dashboard: http://localhost:3000/admin`);

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
  } finally {
    await pool.end();
  }
}

// Fonction pour créer un utilisateur admin
async function createAdminUser(email) {
  console.log(`👤 Création de l'utilisateur admin: ${email}`);
  
  try {
    const result = await pool.query(
      'UPDATE profiles SET role = $1 WHERE email = $2 RETURNING email, role',
      ['super_admin', email]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ Utilisateur ${email} promu au rôle super_admin`);
    } else {
      console.log(`❌ Utilisateur ${email} non trouvé. Créez d'abord un compte sur la plateforme.`);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'create-admin') {
    const email = args[1];
    if (!email) {
      console.error('❌ Usage: node setup-admin-neon.js create-admin email@example.com');
      process.exit(1);
    }
    await createAdminUser(email);
  } else {
    await setupAdminOnNeon();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
