<script>
  import LegalPage from '$lib/components/LegalPage.svelte';
  import { company } from '$lib/index';

  const sections = [
    {
      title: 'Objet de la politique',
      paragraphs: [
        `${company.brand} traite certaines données personnelles pour opérer la plateforme, gérer les comptes, traiter les réservations, assurer l’assistance et sécuriser les accès.`,
        'Ce modèle a été revu pour refléter une exploitation au Bénin et doit être finalisé selon vos traitements réels, vos sous-traitants et vos bases légales internes.',
        'Avant publication, vérifiez le périmètre des données collectées dans vos formulaires, tableaux de bord, événements, e-mails transactionnels et outils marketing.'
      ]
    },
    {
      title: 'Catégories de données traitées',
      bullets: [
        'Données d’identification : nom, prénom, e-mail, téléphone, identifiant de compte.',
        'Données de réservation : événements choisis, billets, historique, statut de commande.',
        'Données de paiement : références de transaction, statuts, moyen utilisé via votre prestataire.',
        'Données techniques : logs, navigateur, appareil, adresse IP, préférences de session.',
        'Données support : messages envoyés au service client, pièces jointes et traces de traitement.'
      ]
    },
    {
      title: 'Finalités et bases de traitement',
      cards: [
        { title: 'Créer et administrer les comptes', desc: 'Gestion des inscriptions, connexions et profils.' },
        { title: 'Exécuter les réservations', desc: 'Traitement des billets, confirmations et justificatifs.' },
        { title: 'Fournir l’assistance', desc: 'Réponses aux demandes, support technique et suivi qualité.' },
        { title: 'Sécuriser la plateforme', desc: 'Prévention de la fraude, journalisation et contrôle d’accès.' },
        { title: 'Piloter l’activité', desc: 'Tableaux de bord, reporting, amélioration produit et analytics selon vos choix.' },
        { title: 'Respecter vos obligations légales', desc: 'Conservation de certaines pièces, gestion des litiges et coopération avec les autorités compétentes.' }
      ],
      note: 'Dans votre version finale, associez chaque finalité à sa base juridique et au fondement exact retenu dans votre organisation.'
    },
    {
      title: 'Destinataires et sous-traitants',
      paragraphs: [
        'Les données peuvent être accessibles aux équipes internes habilitées, aux organisateurs concernés, aux prestataires techniques d’hébergement, aux outils d’assistance, aux prestataires d’envoi d’e-mails et aux prestataires de paiement.',
        'La liste précise des sous-traitants doit être documentée et tenue à jour. Les accès doivent être limités selon les besoins métiers.'
      ]
    },
    {
      title: 'Conservation et sécurité',
      bullets: [
        'Définissez une durée de conservation par type de donnée et par usage.',
        'Protégez les accès par des mesures d’authentification, de journalisation et de contrôle des habilitations.',
        'Évitez de conserver les données de paiement sensibles si elles sont déjà gérées par un PSP.',
        'Documentez vos sauvegardes, restaurations, incidents et procédures de revue périodique.'
      ]
    },
    {
      title: 'Droits des personnes',
      paragraphs: [
        'Prévoyez un canal clair pour les demandes d’accès, de rectification, d’opposition, de limitation, de suppression ou de portabilité lorsque ces droits s’appliquent.',
        `Les demandes peuvent être adressées à ${company.legalEmail}. Vous devez définir un processus interne de réponse, de vérification d’identité et de traçabilité.`
      ],
      note: 'Ce document fait référence au cadre béninois de protection des données. Validez la formulation exacte avec votre conseil ou votre responsable conformité selon votre situation.'
    }
  ];
</script>

<LegalPage
  title="Politique de confidentialité"
  subtitle="Comment la plateforme collecte, utilise, conserve et protège les données personnelles dans un contexte SaaS au Bénin."
  lastUpdated="9 mars 2026"
  {sections}
  relatedLinks={[
    { label: 'Mentions légales', href: '/terms/mention' },
    { label: 'Politique de cookies', href: '/terms/cookies' },
    { label: 'Centre d’aide', href: '/terms/support' }
  ]}
/>
