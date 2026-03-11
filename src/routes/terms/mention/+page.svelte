<script>
  import LegalPage from '$lib/components/LegalPage.svelte';
  import { company } from '$lib/index';

  const sections = [
    {
      title: 'Éditeur de la plateforme',
      cards: [
        { label: 'Raison sociale', value: company.legalName },
        { label: 'Forme juridique', value: '[À compléter] SARL / SA selon votre structure' },
        { label: 'RCCM', value: '[À compléter]' },
        { label: 'IFU', value: '[À compléter]' },
        { label: 'NPI du représentant', value: '[À compléter si applicable]' },
        { label: 'Siège social', value: '[À compléter] Cotonou, Bénin' },
        { label: 'Téléphone', value: company.phone },
        { label: 'E-mail', value: company.email },
        { label: 'Directeur de publication', value: '[À compléter]' },
        { label: 'Responsable conformité', value: '[À compléter]' }
      ],
      note: 'Les mentions ont été localisées pour un SaaS au Bénin. Remplace tous les champs placeholders avant publication.'
    },
    {
      title: 'Hébergement et infrastructure',
      paragraphs: [
        'Indiquez ici votre hébergeur principal, le pays d’hébergement, le fournisseur d’e-mails transactionnels, ainsi que les prestataires critiques utilisés par la plateforme.',
        'Si certains traitements ou sauvegardes sont réalisés hors du Bénin, décrivez les garanties contractuelles et opérationnelles mises en place.',
        'Pour un produit SaaS, il est préférable d’indiquer clairement les briques utilisées : hébergement applicatif, base de données, analytics, support client et paiement.'
      ],
      cards: [
        { label: 'Hébergeur principal', value: '[À compléter]' },
        { label: 'Localisation des serveurs', value: '[À compléter]' },
        { label: 'Prestataire e-mail', value: '[À compléter]' },
        { label: 'Prestataire de paiement', value: '[À compléter]' }
      ]
    },
    {
      title: 'Propriété intellectuelle',
      paragraphs: [
        `L’ensemble des éléments de ${company.brand} — marque, interface, code, textes, bases de données, visuels, composants graphiques et documentation — demeure protégé par les règles applicables en matière de propriété intellectuelle.`,
        'Sauf autorisation écrite préalable, toute reproduction, extraction substantielle, diffusion ou exploitation commerciale de tout ou partie du service est interdite.',
        'Les contenus fournis par les organisateurs ou utilisateurs restent sous leur responsabilité. Ils garantissent disposer des droits nécessaires pour les publier sur la plateforme.'
      ]
    },
    {
      title: 'Responsabilité',
      bullets: [
        'La plateforme agit comme opérateur technique et outil de gestion, sauf stipulation contraire dans vos CGU.',
        'Les informations d’événements publiées par des tiers restent sous la responsabilité de leurs auteurs.',
        'Le service peut être interrompu temporairement pour maintenance, sécurité ou évolution fonctionnelle.',
        'L’éditeur ne garantit pas l’absence totale d’erreurs, de coupures réseau ou d’indisponibilité de prestataires tiers.'
      ]
    },
    {
      title: 'Signalement et contact',
      paragraphs: [
        `Pour toute demande légale, signalement, réclamation ou notification, utilisez ${company.legalEmail} et conservez une preuve de votre envoi.`,
        'Ajoutez si nécessaire une adresse postale de notification et un canal spécifique pour les demandes liées aux données personnelles.'
      ]
    }
  ];
</script>

<LegalPage
  title="Mentions légales"
  subtitle="Modèle localisé pour une plateforme SaaS exploitée au Bénin, avec champs à compléter avant mise en ligne."
  lastUpdated="9 mars 2026"
  {sections}
  relatedLinks={[
    { label: 'CGU', href: '/terms/cgu' },
    { label: 'Politique de confidentialité', href: '/terms/privacy' },
    { label: 'Politique de cookies', href: '/terms/cookies' }
  ]}
/>
