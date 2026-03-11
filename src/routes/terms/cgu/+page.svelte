<script>
  import LegalPage from "$lib/components/LegalPage.svelte";
  import { company } from "$lib/index";

  const sections = [
    {
      title: "Présentation et acceptation",
      paragraphs: [
        `${company.brand} est une plateforme SaaS de gestion et de diffusion d’événements. Les présentes conditions encadrent l’accès au service par les participants, organisateurs, équipes internes et tout autre utilisateur autorisé.`,
        "L’utilisation du site, de l’espace organisateur ou de tout service associé vaut acceptation des présentes conditions et des documents liés (confidentialité, cookies, politique commerciale et conditions spécifiques organisateur si elles existent).",
        "Ce modèle a été réécrit pour un usage au Bénin. Il doit être finalisé avec vos règles commerciales, votre modèle de reversement et vos obligations contractuelles réelles.",
      ],
    },
    {
      title: "Définitions",
      definitions: [
        {
          term: "Plateforme",
          def: "Le site web, le tableau de bord et les services opérés par la société éditrice.",
        },
        {
          term: "Organisateur",
          def: "Toute personne physique ou morale qui crée, gère ou commercialise un événement via la plateforme.",
        },
        {
          term: "Participant",
          def: "Toute personne qui consulte, réserve ou utilise un billet pour accéder à un événement.",
        },
        {
          term: "Billet",
          def: "Le titre d’accès numérique ou physique associé à une réservation validée.",
        },
        {
          term: "Compte",
          def: "L’espace utilisateur permettant d’accéder aux fonctionnalités réservées.",
        },
      ],
    },
    {
      title: "Accès au service et comptes",
      bullets: [
        "Certaines fonctionnalités sont accessibles librement, d’autres nécessitent la création d’un compte.",
        "L’utilisateur s’engage à fournir des informations exactes et à jour.",
        "Chaque utilisateur est responsable de la confidentialité de ses accès et de l’usage fait depuis son compte.",
        "L’éditeur peut suspendre un accès en cas d’usage frauduleux, de non-respect des CGU ou de risque de sécurité.",
      ],
    },
    {
      title: "Services proposés",
      cards: [
        {
          title: "Billetterie en ligne",
          desc: "Création de billets, réservation et suivi d’inscriptions.",
        },
        {
          title: "Espace organisateur",
          desc: "Gestion des événements, du catalogue, des ventes et des participants.",
        },
        {
          title: "Tableaux de bord",
          desc: "Visualisation des performances, des inscriptions et des actions à mener.",
        },
        {
          title: "Support client",
          desc: "Assistance commerciale ou technique via les canaux définis par la société.",
        },
        {
          title: "Outils marketing",
          desc: "Mises en avant, pages événementielles et campagnes selon votre offre.",
        },
        {
          title: "Reporting",
          desc: "Exports, statistiques et suivi opérationnel selon le plan souscrit.",
        },
      ],
    },
    {
      title: "Réservation, paiement et frais",
      paragraphs: [
        "Les réservations sont confirmées après validation du paiement ou de la règle d’inscription prévue par l’organisateur.",
        "Les prix peuvent être affichés en franc CFA (FCFA / XOF). Les frais de service éventuels doivent être visibles avant confirmation.",
        "Le mode de paiement exact dépend de votre intégration technique : Mobile Money, carte bancaire, virement ou autre solution.",
      ],
      note: "Dans ce pack Svelte, aucune transaction n’est exécutée. Les confirmations sont simulées localement.",
    },
    {
      title: "Obligations des utilisateurs",
      bullets: [
        "Ne pas publier d’informations mensongères, illicites ou portant atteinte aux droits de tiers.",
        "Ne pas contourner les contrôles d’accès, automatiser abusivement l’usage du service ou extraire les données sans autorisation.",
        "Ne pas revendre des billets ou accès en violation des règles fixées par l’organisateur ou par la plateforme.",
        "Utiliser le service dans le respect des lois applicables, de l’ordre public et des bonnes pratiques professionnelles.",
      ],
    },
    {
      title: "Obligations des organisateurs",
      bullets: [
        "Publier des informations exactes sur les événements, lieux, tarifs, horaires et conditions d’accès.",
        "Disposer des autorisations nécessaires pour organiser l’événement et encaisser les paiements.",
        "Assurer la conformité des contenus, des droits d’auteur, des autorisations administratives et des mesures de sécurité liées à l’événement.",
        "Traiter les demandes participants, annulations ou reports selon les règles communiquées au moment de la vente.",
      ],
    },
    {
      title: "Disponibilité, responsabilité et résiliation",
      paragraphs: [
        "La plateforme est fournie selon une obligation de moyens. Des interruptions peuvent survenir pour maintenance, sécurité, mise à jour ou défaillance d’un tiers.",
        "Chaque partie reste responsable de ses propres fautes, contenus et obligations. L’éditeur n’est pas responsable des événements eux-mêmes lorsqu’ils sont organisés par des tiers.",
        "L’accès au service peut être suspendu ou résilié en cas de manquement grave, d’impayé, d’usage abusif ou de risque réglementaire.",
      ],
    },
    {
      title: "Droit applicable et règlement des litiges",
      paragraphs: [
        "Précisez dans votre version finale le droit applicable, la juridiction compétente et les éventuelles étapes amiables préalables.",
        "Pour un SaaS opéré au Bénin, ce point doit être aligné avec votre structure juridique, vos clients cibles et vos contrats B2B ou B2C.",
      ],
    },
  ];
</script>

<LegalPage
  title="Conditions générales d’utilisation"
  subtitle="Base contractuelle réécrite pour une plateforme SaaS événementielle au Bénin, à compléter avant déploiement commercial."
  lastUpdated="9 mars 2026"
  {sections}
  relatedLinks={[
    { label: "Mentions légales", href: "/terms/mention" },
    { label: "Politique de confidentialité", href: "/terms/privacy" },
    { label: "Centre d’aide", href: "/terms/support" },
  ]}
/>
