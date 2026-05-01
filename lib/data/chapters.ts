import type { Chapter } from "@/types";

export const CHAPTERS: Chapter[] = [
  {
    num: 1,
    eunuque: "Mehuman",
    title: "La Fidélité",
    subtitle: "L'alerte du fondement",
    why: `Ce chapitre te concerne si dans ta relation, les engagements ne sont plus respectés. Tu penses peut-être que l'infidélité débute avec les relations sexuelles mais tu verras qu'il y a beaucoup plus profond.`,
    lili: `Ma reine, l'infidélité ne débute pas toujours dans un lit. Ouvre les yeux afin de remarquer la présence du premier eunuque.`,
    keys: [
      { t: "Reste une aide pour ton mari", s: "Dieu a conçu les femmes pour qu'elles aident leurs maris à devenir tout ce que Dieu veut qu'ils soient." },
      { t: "Protège les espaces de complicité avec ROI", s: "L'intimité se construit dans les petits moments quotidiens, pas seulement dans les grands gestes." },
      { t: "Aime ton mari inconditionnellement", s: "Les besoins de ton mari devraient être plus importants et plus élevés sur ta liste de priorités." },
    ],
    journalQs: [
      "Est-ce que les engagements de départ sont encore honorés dans notre relation ? Lesquels ont changé ?",
      "Qu'est-ce que la fidélité signifie vraiment pour toi dans ton couple avec ROI ?",
      "Y a-t-il un signe que tu as peut-être ignoré ces derniers temps concernant la fidélité dans ta relation ?",
    ],
    actions: [
      "Observer pendant 48h les attitudes de ROI sans jugement",
      "Créer un moment de conversation sincère avec ROI concernant un sujet de ton choix",
      "Prier spécifiquement pour la protection et la restauration de la fidélité dans votre couple",
    ],
    question: {
      s: `ROI rentre de plus en plus tard. Il est souvent sur son téléphone et devient défensif quand tu poses des questions. Tu as une intuition mais tu n'as aucune preuve.`,
      c: [
        { t: "Tu lui poses la question directement, avec calme et sans accusation, en exprimant ce que tu ressens.", ok: true, f: "Courageux et sage. Exprimer ce qu'on ressent sans attaquer ouvre la porte à une vraie conversation. C'est la posture d'une femme sage." },
        { t: "Tu fouilles son téléphone pendant qu'il dort pour avoir des preuves.", ok: false, f: "L'eunuque suivant approche. La méfiance sans dialogue crée une spirale qui blesse les deux conjoints. Ce que tu trouves ou ne trouves pas ne remplacera jamais la conversation nécessaire." },
        { t: "Tu gardes tout en toi et tu fais semblant que tout va bien.", ok: false, f: "Le silence face à une intuition forte accumule de la douleur. L'eunuque suivant approche." },
      ],
    },
  },
  {
    num: 2,
    eunuque: "Biztha",
    title: "Les Acquis",
    subtitle: "L'alerte de l'habitude",
    why: `Il fut un temps où tu faisais des efforts pour ROI. Aujourd'hui, il est là, et tu as peut-être cessé d'investir. Les acquis s'installent doucement, comme la poussière sur un tableau précieux. Ce chapitre te pose une question difficile : qu'est-ce que tu as cessé de faire pour ton couple parce que tu pensais qu'il resterait quoi qu'il arrive ?`,
    lili: `Ma reine, l'amour ne se maintient pas tout seul. Il se cultive, il se nourrit, il se choisit chaque jour. Ce que tu tiens pour acquis, tu cesses de le chérir. Et ce que tu cesses de chérir, tu finiras par le perdre.`,
    keys: [
      { t: "Dieu au centre de ton mariage", s: "Si tu ne sais pas mettre Dieu au centre de ton couple, il y a très peu de chances que tu parviennes à gérer les feux de l'adversité convenablement." },
      { t: "Cultive l'amour sacrificiel", s: "On ne prend pas soin de son époux parce qu'il le mérite. Essaie d'aimer ton conjoint tel qu'il est, et tu verras les grands bénéfices qui en résulteront." },
      { t: "Pardonne !", s: "Le pardon est un choix et tu dois choisir de pardonner lorsque ton époux te fait du mal." },
    ],
    journalQs: [
      "Quelles habitudes as-tu abandonnées avec ROI depuis le début de la relation ?",
      "Est-ce que ROI se sent vu, apprécié et choisi par toi aujourd'hui ?",
      "Quelle surprise simple pourrais-tu lui faire cette semaine pour lui montrer qu'il compte encore ?",
    ],
    actions: [
      "Lui écrire un message sincère listant 5 qualités que tu admires en lui",
      "Lui proposer une activité qu'il aime, même si ce n'est pas ta préférence",
      "Dire merci à voix haute pour une chose concrète qu'il fait chaque jour",
    ],
    question: {
      s: `ROI t'a demandé de venir à son événement important. Tu as oublié et tu as fait autre chose. Il rentre déçu mais ne dit rien.`,
      c: [
        { t: "Tu t'en excuses sincèrement et tu lui demandes ce que tu peux faire pour réparer.", ok: true, f: "Magnifique. La capacité à reconnaître ses erreurs sans se défendre est une force, pas une faiblesse. C'est ce qui reconstruit la confiance." },
        { t: "Tu te justifies avec tes raisons, tu avais vraiment beaucoup à faire.", ok: false, f: "L'eunuque suivant approche. La justification, même vraie, efface l'empathie. Ce qu'il avait besoin d'entendre, c'est que ça comptait pour toi." },
        { t: "Tu fais semblant de ne pas avoir remarqué qu'il est déçu.", ok: false, f: "L'eunuque suivant approche. L'évitement des sujets difficiles accumule des briques invisibles entre vous." },
      ],
    },
  },
  {
    num: 3,
    eunuque: "Harbona",
    title: "La Critique",
    subtitle: "L'alerte de la langue",
    why: `Trop maigre, trop grosse, pas assez éloquente… ROI commence à critiquer tout ce que tu fais… La critique chronique envoie un message : tu n'es pas assez bien. Attention, Harbona est dans la place !`,
    lili: `Ma reine, lorsque tu remarques Harbona, ne dis pas "Je m'en fiche, c'est moi qui ai la bague au doigt…", une telle réaction est un mépris du signal !`,
    keys: [
      { t: "Ne contre-attaque pas !", s: "La femme sage doit apprendre à gérer les critiques de son mari en devenant plus forte spirituellement et émotionnellement." },
      { t: "La prière est une arme puissante", s: "Agis comme Esther, prends toujours le temps de prier et de trouver le calme intérieur avant d'agir ou de parler." },
      { t: "Sois douce !", s: "Avant que la querelle ne naisse, stoppe son élan en répondant avec amour et douceur, tu peux y arriver ma Reine !" },
    ],
    journalQs: [
      "Quels sont les 3 sujets sur lesquels ROI te critique le plus souvent ?",
      "Le sujet de sa critique est-il quelque chose que tu peux changer ?",
      "Comment réagis-tu lorsque ROI émet des critiques ?",
    ],
    actions: [
      "Prie pour avoir une stabilité émotionnelle et spirituelle",
      "Ne réagis pas automatiquement lorsque tu te sens blessée, prends le temps de prier",
      "Identifie une critique récurrente et décide d'améliorer les choses",
    ],
    question: {
      s: `Vous êtes à la maison, en fin de journée. ROI te regarde et te dit calmement : "Honnêtement… je n'aime plus trop ta façon de t'habiller ces derniers temps." Tu es surprise. Un peu blessée.`,
      c: [
        { t: `Tu te braques immédiatement : "Ah bon ? Et toi t'as vu comment tu t'habilles ?"`, ok: false, f: "L'eunuque s'approche. Répondre à la critique par l'attaque crée une distance immédiate. Tu as voulu te défendre… mais tu as nourri la tension." },
        { t: `Tu respires et tu lui réponds calmement : "D'accord… qu'est-ce que tu aimerais que je change ?"`, ok: true, f: "La sagesse de la reine : savoir écouter sans se fermer. Tu n'as pas pris la critique comme une attaque, mais comme une porte de dialogue." },
        { t: "Tu te renfermes intérieurement, tu ne dis rien… mais tu prends mal la remarque.", ok: "partial", f: "Ta couronne vacille. Le silence protège le moment… mais pas ton cœur. Une blessure non exprimée finit toujours par ressortir ailleurs." },
      ],
    },
  },
  {
    num: 4,
    eunuque: "Bigtha",
    title: "L'Orgueil",
    subtitle: "L'alerte du mur intérieur",
    why: `Ce chapitre te pose une question directe : dans tes conflits avec ROI, est-ce que tu cherches la paix ou la victoire ?`,
    lili: `Ma reine, j'ai vu des femmes préférer avoir raison plutôt qu'être heureuses dans leur foyer. L'orgueil dit : je ne m'excuserai pas. L'amour dit : je préfère notre paix à ma fierté. L'un construit des murs. L'autre bâtit des ponts.`,
    keys: [
      { t: "Prends le temps de guérir", s: "Une femme qui transporte des blessures dans son âme sera plus encline à la violence verbale, à la rébellion et à l'esprit de domination." },
      { t: "Sois un artisan de paix dans ton foyer", s: "Cultiver la paix, c'est souvent renoncer volontairement aux querelles et accepter de garder le silence." },
      { t: "Savoir renoncer à l'envie de tout contrôler", s: "Cette tendance à vouloir tout maîtriser, tout contrôler, tout diriger est ce qui t'empêche de vivre en harmonie avec ton mari." },
    ],
    journalQs: [
      "Lors de la dernière dispute avec ROI, étais-tu en train de chercher la paix ou ta raison ?",
      "Y a-t-il quelque chose à pardonner à ROI que tu gardes encore sans l'avoir dit ?",
      "Que pourrais-tu faire pour cultiver la paix dans ton foyer ?",
    ],
    actions: [
      "S'excuser pour quelque chose que tu n'as jamais vraiment reconnu",
      "Décider d'une règle dans vos conflits",
      "Finir la prochaine dispute par 'je t'aime' peu importe le résultat",
    ],
    question: {
      s: `Vous avez eu une dispute hier. Tu avais raison sur le fond. ROI n'a pas encore reconnu son tort. Il agit normalement aujourd'hui.`,
      c: [
        { t: "Tu t'approches de lui affectueusement. La paix compte plus que le fait d'avoir raison.", ok: true, f: "Bigtha n'aura pas de place dans ton couple !" },
        { t: "Tu gardes une distance froide jusqu'à ce qu'il reconnaisse son erreur.", ok: false, f: "L'eunuque suivant approche. Le silence punitif crée de la distance sans rien résoudre." },
        { t: `Tu lui envoies un message : "Je t'aime. On en reparle quand tu es prêt ?"`, ok: true, f: "Élégant et courageux." },
      ],
    },
  },
  {
    num: 5,
    eunuque: "Abagtha",
    title: "La Perte du Bonheur",
    subtitle: "L'alerte de la joie enfouie",
    why: `Quand as-tu ri vraiment avec ROI pour la dernière fois ? La cinquième alerte est l'une des plus douloureuses parce qu'elle arrive silencieusement. Un jour tu réalises que la joie a disparu de ton couple, et tu ne sais plus exactement quand elle est partie.`,
    lili: `Ma reine, la joie dans un couple ne meurt pas d'un seul coup. Elle part à petits pas, volée par le sérieux, la routine, les blessures non soignées. Déclare que les ossements desséchés pourront revivre !`,
    keys: [
      { t: "Retrouve tes bonnes habitudes", s: "Reviens à ton premier amour, pratique tes premières œuvres envers ton conjoint !" },
      { t: "Ne néglige pas le langage de l'amour de ton conjoint", s: "Chaque personne exprime et reçoit l'amour différemment. Connais le langage de ROI et parle-lui dedans." },
      { t: "Crée des rituels de bonheur réguliers", s: "Un café partagé le matin, un film le vendredi, une promenade le samedi. Les rituels créent de l'appartenance." },
    ],
    journalQs: [
      "Quand avons-nous ri vraiment ensemble, ROI et moi, pour la dernière fois ?",
      "Qu'est-ce qui a volé notre joie ces 6 derniers mois ? Quels sont les facteurs ?",
      "Quel rituel de bonheur simple pourrais-je proposer à ROI cette semaine ?",
    ],
    actions: [
      "Planifier une soirée en amoureux",
      "Lui envoyer quelque chose qui vous ferait rire tous les deux",
      "Sortir faire quelque chose que vous n'avez jamais fait ensemble",
    ],
    question: {
      s: `Cela fait des semaines que vous n'avez pas partagé un moment de qualité ensemble. Ce soir, ROI propose de regarder un film comique. Tu es fatiguée.`,
      c: [
        { t: "Tu acceptes.", ok: true, f: "Oui. Choisir la connexion même quand tu es fatiguée, c'est un investissement dans votre énergie commune." },
        { t: "Tu refuses. Tu préfères dormir tôt.", ok: false, f: "L'eunuque suivant approche. Si 'demain' ne vient jamais, la fatigue finit par avoir raison de la joie. Cherche l'équilibre." },
      ],
    },
  },
  {
    num: 6,
    eunuque: "Zéthar",
    title: "L'Intervention Divine",
    subtitle: "L'alerte spirituelle",
    why: `Certains couples traversent les mêmes tempêtes et en sortent renforcés, pendant que d'autres n'y survivent pas. La différence ? Ont-ils invité Dieu dans leur couple, ou ont-ils essayé de tout porter seuls ? Ce chapitre t'invite à reconnaître que ton couple est une alliance, et que ROI et toi n'êtes pas seuls dans cette histoire.`,
    lili: `Ma reine, le couple que Dieu n'habite pas est bâti sur du sable. Prie pour ROI avant de lui parler de ses défauts. Prie pour toi avant de lui exprimer tes attentes. L'intervention divine commence toujours par une femme qui s'agenouille.`,
    keys: [
      { t: "Sois la dame de Carcassonne !", s: "Lis cette histoire à la page 138 de ton livre." },
      { t: "Prête attention aux personnes qui te conseillent", s: "Les personnes qui nous entourent peuvent constituer une menace pour la sécurité de nos relations amoureuses." },
      { t: "Ne te prive pas de la grâce de Dieu", s: "Reconnais la main de Dieu et saisis-la, même si elle paraît incroyable et irréelle, même si elle paraît disproportionnée." },
    ],
    journalQs: [
      "Quelle place occupe la foi dans ton couple avec ROI aujourd'hui ? Comment voudrais-tu que ça évolue ?",
      "Est-ce que tu pries pour ROI régulièrement ?",
      "Y a-t-il une blessure dans ton couple que seule une intervention divine pourrait vraiment guérir ?",
    ],
    actions: [
      "Prier 15 minutes spécifiquement pour ROI chaque matin pendant 7 jours",
      "Lui proposer une prière commune courte, même 2 minutes avant de dormir",
      "Lui écrire un message qui commence par 'Je prie pour toi parce que…'",
    ],
    question: {
      s: `Vous traversez une crise difficile. La tension est permanente. Chacun accuse l'autre de mauvaises décisions. La communication est bloquée.`,
      c: [
        { t: "Tu proposes de prier ensemble avant chaque discussion difficile.", ok: true, f: "Magnifique instinct. Aller devant Dieu ensemble avant les débats change l'atmosphère et la posture de chacun." },
        { t: "Tu gardes ta liste mentale de qui a pris quelles décisions pour la sortir au bon moment.", ok: false, f: "L'eunuque suivant approche. Cette liste n'a qu'un usage : blesser. Et elle ne résoudra rien. Lâche-la pour construire ensemble." },
        { t: "Tu cherches un accompagnement sage, pasteur ou conseiller aligné avec vos valeurs.", ok: true, f: "Excellent. Chercher de l'aide externe sage, c'est aussi de la maturité." },
      ],
    },
  },
  {
    num: 7,
    eunuque: "Carcas",
    title: "Le Point de Rupture",
    subtitle: "L'alerte finale",
    why: `Tu lis peut-être ce chapitre avec une boule dans la gorge. Parce que quelque chose en toi reconnaît ce nom. Le point de rupture. Ce chapitre n'est pas là pour te culpabiliser. Il est là pour te dire que tu n'es pas obligée d'y arriver. Et que si tu y es déjà, il n'est pas trop tard.`,
    lili: `Ma reine, ici, il ne s'agit pas de savoir si tu as raison ou pas. Viens avec humilité dans la présence de Dieu, reconnais tes erreurs et laisse le Seigneur rebâtir ta maison !`,
    keys: [
      { t: "Donne-lui de l'espace", s: "En laissant de l'espace à ROI, tu lui montres que tu respectes son droit à avoir ses propres sentiments, même si tu vois les choses différemment." },
      { t: "Assume ton rôle !", s: "Vous êtes tous deux responsables à part égale mais toi, décide de prendre tes responsabilités de femme." },
      { t: "Écoute plus que tu ne parles", s: "Et si tu renonçais à l'envie de te justifier à tout prix ?" },
    ],
    journalQs: [
      "Est-ce que ton couple traverse un point de rupture en ce moment ?",
      "Quelles actions pourrais-tu mettre en place pour éviter que l'eunuque Carcas vienne à ta rencontre ?",
    ],
    actions: [
      "Chercher un accompagnement : pasteur, thérapeute ou conseiller conjugal",
      "Se souvenir de la raison pour laquelle tu as choisi ROI au début, l'écrire",
    ],
    question: {
      s: `Après une série de disputes épuisantes avec ROI, tu te sens au bout. Tu penses pour la première fois à l'idée de partir.`,
      c: [
        { t: "Tu ne prends aucune décision dans cet état. Tu cherches d'abord du soutien.", ok: true, f: "Sage. Les décisions de rupture prises dans l'épuisement ou la douleur maximale sont rarement les meilleures. Stabilise-toi d'abord." },
        { t: "Tu vides toute ta douleur accumulée sur ROI en une seule conversation.", ok: false, f: "L'eunuque Carcas est déjà là. Vider toute la douleur en une seule conversation de crise peut tout faire exploser. Parle d'abord à quelqu'un de confiance." },
        { t: "Tu proposes à ROI une thérapie de couple. Si ça ne marche pas, tu aviseras.", ok: true, f: "Courageux et sage. Tu choisis activement de te battre pour ton couple avant de conclure que c'est fini." },
      ],
    },
  },
];

export const CHAP_MAP: Record<number, Chapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.num, c])
);
