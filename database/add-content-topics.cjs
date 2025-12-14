/**
 * Migration: Add content_topics table
 *
 * This script creates a content_topics table with theme and topic columns
 * and populates it with the provided data.
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function addContentTopicsTable() {
  const sql = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED);

  try {
    console.log('🚀 Starting content_topics table migration...');

    // Create the content_topics table
    console.log('📋 Creating content_topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS content_topics (
        id SERIAL PRIMARY KEY,
        theme TEXT NOT NULL,
        topic TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Table created successfully');

    // Insert the data
    console.log('📝 Inserting content topics...');

    const topics = [
      // Alltag und Lebensführung
      { theme: 'Alltag und Lebensführung', topic: 'Organisation des Alltags in einer Wohngemeinschaft' },
      { theme: 'Alltag und Lebensführung', topic: 'Herausforderungen bei der Wohnungssuche in Großstädten' },
      { theme: 'Alltag und Lebensführung', topic: 'Umgang mit steigenden Lebenshaltungskosten im Alltag' },
      { theme: 'Alltag und Lebensführung', topic: 'Nachhaltige Entscheidungen beim täglichen Einkauf' },
      { theme: 'Alltag und Lebensführung', topic: 'Gesunde Ernährung trotz Zeitmangel' },
      { theme: 'Alltag und Lebensführung', topic: 'Planung und Organisation eines Umzugs' },
      { theme: 'Alltag und Lebensführung', topic: 'Zeitmanagement zwischen Haushalt, Arbeit und Freizeit' },
      { theme: 'Alltag und Lebensführung', topic: 'Arztbesuche und Vorsorge im Alltag' },
      { theme: 'Alltag und Lebensführung', topic: 'Sport und Bewegung als Ausgleich zum Alltag' },
      { theme: 'Alltag und Lebensführung', topic: 'Freizeitgestaltung neben Studium oder Beruf' },
      { theme: 'Alltag und Lebensführung', topic: 'Nutzung öffentlicher Verkehrsmittel im Alltag' },
      { theme: 'Alltag und Lebensführung', topic: 'Sicherheit und Versicherungen im täglichen Leben' },

      // Bildung, Lernen, Studium
      { theme: 'Bildung, Lernen, Studium', topic: 'Der Studienalltag an einer deutschen Universität' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Vorbereitung auf Prüfungen im Studium' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Organisation von Lernphasen während des Semesters' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Herausforderungen beim Schreiben von Hausarbeiten' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Gruppenarbeit und Projektarbeit im Studium' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Digitale Lehrformate im Hochschulalltag' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Finanzierung des Studiums durch Nebenjobs' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Praktika als Teil der akademischen Ausbildung' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Nutzung der Universitätsbibliothek für das Lernen' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Umgang mit Prüfungsstress und Leistungsdruck' },
      { theme: 'Bildung, Lernen, Studium', topic: 'Sprachlernen neben dem Studium' },

      // Arbeit und Beruf
      { theme: 'Arbeit und Beruf', topic: 'Der Einstieg ins Berufsleben nach dem Studium' },
      { theme: 'Arbeit und Beruf', topic: 'Der Arbeitsalltag in einem modernen Unternehmen' },
      { theme: 'Arbeit und Beruf', topic: 'Kommunikation im Team und im Arbeitsumfeld' },
      { theme: 'Arbeit und Beruf', topic: 'Organisation von Aufgaben und Prioritäten im Job' },
      { theme: 'Arbeit und Beruf', topic: 'Arbeiten im Homeoffice und im Büro' },
      { theme: 'Arbeit und Beruf', topic: 'Vereinbarkeit von Beruf und Privatleben' },
      { theme: 'Arbeit und Beruf', topic: 'Berufliche Weiterbildung neben der Arbeit' },
      { theme: 'Arbeit und Beruf', topic: 'Bewerbung um eine neue Arbeitsstelle' },
      { theme: 'Arbeit und Beruf', topic: 'Zusammenarbeit in internationalen Teams' },
      { theme: 'Arbeit und Beruf', topic: 'Umgang mit Feedback am Arbeitsplatz' },

      // Gesellschaft und Zusammenleben
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Zusammenleben verschiedener Generationen' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Rolle von Ehrenamt und freiwilligem Engagement' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Integration im gesellschaftlichen Alltag' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Leben in der Stadt im Vergleich zum Leben auf dem Land' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Soziale Verantwortung in der Nachbarschaft' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Veränderungen traditioneller Familienmodelle' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Bedeutung von Gleichberechtigung im Alltag' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Zusammenhalt und gegenseitige Unterstützung' },
      { theme: 'Gesellschaft und Zusammenleben', topic: 'Herausforderungen des demografischen Wandels' },

      // Medien, Kommunikation, Digitalisierung
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Nutzung sozialer Medien im Alltag' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Chancen und Risiken digitaler Kommunikation' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Umgang mit Informationen im Internet' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Digitale Technologien im täglichen Leben' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Datenschutz und Privatsphäre online' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Veränderungen der Kommunikation durch Smartphones' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Bedeutung digitaler Kompetenzen im Alltag' },
      { theme: 'Medien, Kommunikation, Digitalisierung', topic: 'Online-Kommunikation im beruflichen Kontext' },

      // Umwelt, Klima, Nachhaltigkeit
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Umweltschutz im Alltag' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Nachhaltiger Konsum und bewusste Entscheidungen' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Müllvermeidung und Recycling im Haushalt' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Klimafreundliche Mobilität im Alltag' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Energie sparen in Wohnung und Haushalt' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Verantwortung des Einzelnen für die Umwelt' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Bedeutung regionaler Produkte' },
      { theme: 'Umwelt, Klima, Nachhaltigkeit', topic: 'Umweltbewusstsein bei jungen Menschen' },

      // Wissenschaft, Technik, Innovation
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Technischer Fortschritt im Alltag' },
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Neue Technologien und ihre Auswirkungen' },
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Automatisierung und moderne Arbeitswelt' },
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Nutzung digitaler Hilfsmittel im Studium' },
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Technische Innovationen im Gesundheitsbereich' },
      { theme: 'Wissenschaft, Technik, Innovation', topic: 'Chancen und Grenzen künstlicher Intelligenz' },

      // Kultur, Sprache, Identität
      { theme: 'Kultur, Sprache, Identität', topic: 'Bedeutung von Kulturangeboten im Alltag' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Lesen und Mediennutzung in der Freizeit' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Musik und kulturelle Veranstaltungen' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Traditionen und Feste im gesellschaftlichen Leben' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Interkulturelle Begegnungen im Alltag' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Mehrsprachigkeit im persönlichen Umfeld' },
      { theme: 'Kultur, Sprache, Identität', topic: 'Wandel der Sprache im digitalen Zeitalter' },

      // Mobilität und Infrastruktur
      { theme: 'Mobilität und Infrastruktur', topic: 'Pendeln zwischen Wohnort und Arbeitsplatz' },
      { theme: 'Mobilität und Infrastruktur', topic: 'Bedeutung öffentlicher Verkehrsmittel' },
      { theme: 'Mobilität und Infrastruktur', topic: 'Fahrradfahren im Stadtverkehr' },
      { theme: 'Mobilität und Infrastruktur', topic: 'Mobilität im ländlichen Raum' },
      { theme: 'Mobilität und Infrastruktur', topic: 'Barrierefreiheit im öffentlichen Raum' },

      // Politik und öffentliches Leben
      { theme: 'Politik und öffentliches Leben', topic: 'Bürgerbeteiligung auf kommunaler Ebene' },
      { theme: 'Politik und öffentliches Leben', topic: 'Öffentliche Verwaltung im Alltag' },
      { theme: 'Politik und öffentliches Leben', topic: 'Bedeutung politischer Bildung' },
      { theme: 'Politik und öffentliches Leben', topic: 'Gesellschaftliches Engagement junger Menschen' },
      { theme: 'Politik und öffentliches Leben', topic: 'Rolle von Medien in der öffentlichen Meinungsbildung' },

      // Wirtschaft und Finanzen
      { theme: 'Wirtschaft und Finanzen', topic: 'Umgang mit Geld im Alltag' },
      { theme: 'Wirtschaft und Finanzen', topic: 'Planung eines persönlichen Budgets' },
      { theme: 'Wirtschaft und Finanzen', topic: 'Konsumverhalten in Zeiten steigender Preise' },
      { theme: 'Wirtschaft und Finanzen', topic: 'Bedeutung nachhaltigen Wirtschaftens' },
      { theme: 'Wirtschaft und Finanzen', topic: 'Arbeiten und Leben in einer Konsumgesellschaft' },

      // Gesundheit und Gesellschaft
      { theme: 'Gesundheit und Gesellschaft', topic: 'Bedeutung von Bewegung für die Gesundheit' },
      { theme: 'Gesundheit und Gesellschaft', topic: 'Stressbewältigung im Alltag' },
      { theme: 'Gesundheit und Gesellschaft', topic: 'Balance zwischen Arbeit und Erholung' },
      { theme: 'Gesundheit und Gesellschaft', topic: 'Gesundheitsvorsorge im täglichen Leben' },
      { theme: 'Gesundheit und Gesellschaft', topic: 'Verantwortung für die eigene Gesundheit' },

      // Besonders LLM-stabile Themen
      { theme: 'Besonders LLM-stabile Themen', topic: 'Organisation des Tagesablaufs' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Planung von Aufgaben und Terminen' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Entscheidungsfindung im Alltag' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Umgang mit Zeitdruck' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Vorbereitung auf wichtige Termine' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Zusammenarbeit mit anderen Menschen' },
      { theme: 'Besonders LLM-stabile Themen', topic: 'Veränderungen im persönlichen Alltag' },
    ];

    // Insert all topics
    for (const item of topics) {
      await sql`
        INSERT INTO content_topics (theme, topic)
        VALUES (${item.theme}, ${item.topic})
      `;
    }

    console.log(`✅ Inserted ${topics.length} content topics`);

    // Verify the data
    const count = await sql`SELECT COUNT(*) as count FROM content_topics`;
    console.log(`📊 Total rows in content_topics: ${count[0].count}`);

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run the migration
addContentTopicsTable()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
