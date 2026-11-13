CREATE TABLE IF NOT EXISTS platforms (
  id text PRIMARY KEY,
  name varchar(60) NOT NULL,
  category varchar(50) NOT NULL,
  description varchar(180) NOT NULL,
  url varchar(2048) NOT NULL DEFAULT '',
  logo varchar(2048) NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'maintenance')),
  enabled boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  access_count bigint NOT NULL DEFAULT 0 CHECK (access_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS platforms_public_order_idx
  ON platforms (enabled, position, id);

INSERT INTO platforms (id, name, category, description, url, logo, status, enabled, position)
VALUES
  ('batakiplus', 'BatakiPlus', 'Communication numérique', 'Des outils et services pour simplifier vos échanges au quotidien.', '', '', 'available', true, 0),
  ('annoncesmali', 'AnnoncesMali', 'Annonces', 'Une plateforme de publication et de consultation d’annonces.', '', '', 'available', true, 1),
  ('cenou-kibaru', 'CENOU KIBARU', 'Éducation', 'Un espace d’information autour de la gestion des bourses.', '', '', 'available', true, 2),
  ('autres-services', 'Autres services', 'Solutions DATASYS', 'Découvrez les autres solutions numériques de DATASYS.', '', '', 'available', true, 3)
ON CONFLICT (id) DO NOTHING;
