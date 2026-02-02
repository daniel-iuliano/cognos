
import { Language } from './types';

export const translations: Record<Language, any> = {
  en: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: Offline Study Companion",
    uploadDesc: "Upload your study material to generate quizzes, flashcards, and personalized plans instantly. Works entirely offline.",
    uploadBtn: "Upload File",
    formatAlert: "Only PDF, Word, and TXT files are accepted.",
    or: "OR",
    pastePlaceholder: "Paste your text content here...",
    dashboardWelcome: "Welcome Back",
    studying: "Currently studying:",
    settingsTitle: "AI Settings",
    settingsDesc: "This app works offline by default. To enable advanced AI features (powered by Gemini), enter your API key below.",
    saveKey: "Save & Enable AI",
    tools: {
      quiz: { title: "Interactive Quiz", desc: "Test your knowledge with auto-generated questions." },
      flashcards: { title: "Smart Flashcards", desc: "Memorize key concepts with active recall cards." },
      plan: { title: "Adaptive Study Plan", desc: "Get a 4-week structured timeline based on your material." },
      simplify: { title: "Simplify Concepts", desc: "Get a digest of the most important concepts." }
    },
    quiz: {
      noData: "No quiz generated yet.",
      generate: "Generate Quiz",
      generating: "Generating...",
      completed: "Quiz Completed!",
      youGot: "You got",
      correct: "correct",
      retry: "Retry",
      new: "New Quiz",
      question: "Question",
      score: "Score",
      explanation: "Explanation:",
      next: "Next",
      finish: "Finish"
    },
    flashcards: {
      noData: "No flashcards generated yet.",
      generate: "Generate Flashcards",
      creating: "Creating Decks...",
      card: "Card",
      question: "Question",
      answer: "Answer",
      clickFlip: "Click to flip",
      showQuestion: "Show Question",
      showAnswer: "Show Answer",
      newDeck: "Generate New Deck"
    },
    plan: {
      noData: "No study plan generated yet.",
      create: "Create Study Plan",
      designing: "Designing Plan...",
      goal: "Goal:",
      week: "Week",
      hours: "hours",
      priority: "Priority",
      regenerate: "Regenerate Plan",
      refining: "Refining Plan..."
    },
    simplify: {
      title: "Content Digest",
      analyzing: "Analyzing text...",
      placeholder: "Click regenerate to see a summary digest.",
      regenerate: "Regenerate"
    },
    chat: {
      title: "Study Assistant",
      welcome: "Hi! I'm Cognos. Ask me anything about your notes.",
      thinking: "Thinking...",
      placeholder: "Ask a question...",
      error: "Sorry, I encountered an error."
    },
    nav: {
      dashboard: "Dashboard",
      uploadNew: "Upload New"
    }
  },
  es: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: Compañero de Estudio Offline",
    uploadDesc: "Sube tu material de estudio para generar cuestionarios, tarjetas didácticas y planes. Funciona totalmente sin conexión.",
    uploadBtn: "Subir Archivo",
    formatAlert: "Solo se aceptan archivos PDF, Word y TXT.",
    or: "O",
    pastePlaceholder: "Pega tu contenido de texto aquí...",
    dashboardWelcome: "Bienvenido de nuevo",
    studying: "Estudiando actualmente:",
    settingsTitle: "Configuración IA",
    settingsDesc: "Esta app funciona offline. Para activar funciones avanzadas de IA (Gemini), ingresa tu clave API.",
    saveKey: "Guardar y Activar IA",
    tools: {
      quiz: { title: "Cuestionario Interactivo", desc: "Pon a prueba tus conocimientos con preguntas autogeneradas." },
      flashcards: { title: "Tarjetas Inteligentes", desc: "Memoriza conceptos clave con tarjetas de repaso activo." },
      plan: { title: "Plan de Estudio Adaptativo", desc: "Obtén un cronograma estructurado de 4 semanas." },
      simplify: { title: "Resumen de Contenido", desc: "Obtén un resumen de los conceptos más importantes." }
    },
    quiz: {
      noData: "No hay cuestionarios disponibles.",
      generate: "Generar Cuestionario",
      generating: "Generando...",
      completed: "¡Cuestionario Completado!",
      youGot: "Obtuviste",
      correct: "correctas",
      retry: "Reintentar",
      new: "Nuevo Cuestionario",
      question: "Pregunta",
      score: "Puntuación",
      explanation: "Explicación:",
      next: "Siguiente",
      finish: "Finalizar"
    },
    flashcards: {
      noData: "No hay tarjetas disponibles.",
      generate: "Generar Tarjetas",
      creating: "Creando Mazos...",
      card: "Tarjeta",
      question: "Pregunta",
      answer: "Respuesta",
      clickFlip: "Clic para voltear",
      showQuestion: "Mostrar Pregunta",
      showAnswer: "Mostrar Respuesta",
      newDeck: "Generar Nuevo Mazo"
    },
    plan: {
      noData: "No hay plan de estudio disponible.",
      create: "Crear Plan de Estudio",
      designing: "Diseñando Plan...",
      goal: "Meta:",
      week: "Semana",
      hours: "horas",
      priority: "Prioridad",
      regenerate: "Regenerar Plan",
      refining: "Refinando Plan..."
    },
    simplify: {
      title: "Resumen",
      analyzing: "Analizando texto...",
      placeholder: "Haz clic en regenerar para ver el resumen.",
      regenerate: "Regenerar"
    },
    chat: {
      title: "Asistente de Estudio",
      welcome: "¡Hola! Soy Cognos. Pregúntame sobre tus notas.",
      thinking: "Pensando...",
      placeholder: "Haz una pregunta...",
      error: "Lo siento, encontré un error."
    },
    nav: {
      dashboard: "Panel",
      uploadNew: "Subir Nuevo"
    }
  },
  fr: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: Compagnon d'Étude Hors Ligne",
    uploadDesc: "Téléchargez votre matériel d'étude pour générer des quiz et plans. Fonctionne entièrement hors ligne.",
    uploadBtn: "Télécharger un fichier",
    formatAlert: "Seuls les fichiers PDF, Word et TXT sont acceptés.",
    or: "OU",
    pastePlaceholder: "Collez votre texte ici...",
    dashboardWelcome: "Bon retour",
    studying: "Étude en cours :",
    settingsTitle: "Paramètres IA",
    settingsDesc: "Cette appli fonctionne hors ligne. Pour activer l'IA avancée (Gemini), entrez votre clé API.",
    saveKey: "Enregistrer et Activer IA",
    tools: {
      quiz: { title: "Quiz Interactif", desc: "Testez vos connaissances avec des questions auto-générées." },
      flashcards: { title: "Cartes Mémoire", desc: "Mémorisez les concepts clés avec le rappel actif." },
      plan: { title: "Plan d'Étude Adaptatif", desc: "Obtenez un calendrier structuré de 4 semaines." },
      simplify: { title: "Résumé du Contenu", desc: "Obtenez un résumé des concepts importants." }
    },
    quiz: {
      noData: "Aucun quiz généré.",
      generate: "Générer Quiz",
      generating: "Génération...",
      completed: "Quiz Terminé !",
      youGot: "Vous avez",
      correct: "bonnes réponses",
      retry: "Réessayer",
      new: "Nouveau Quiz",
      question: "Question",
      score: "Score",
      explanation: "Explication :",
      next: "Suivant",
      finish: "Terminer"
    },
    flashcards: {
      noData: "Aucune carte générée.",
      generate: "Générer Cartes",
      creating: "Création...",
      card: "Carte",
      question: "Question",
      answer: "Réponse",
      clickFlip: "Cliquer pour retourner",
      showQuestion: "Voir Question",
      showAnswer: "Voir Réponse",
      newDeck: "Générer Nouveau Paquet"
    },
    plan: {
      noData: "Aucun plan d'étude généré.",
      create: "Créer Plan",
      designing: "Conception...",
      goal: "But :",
      week: "Semaine",
      hours: "heures",
      priority: "Priorité",
      regenerate: "Régénérer Plan",
      refining: "Affinage..."
    },
    simplify: {
      title: "Résumé",
      analyzing: "Analyse...",
      placeholder: "Cliquez sur régénérer pour voir le résumé.",
      regenerate: "Régénérer"
    },
    chat: {
      title: "Assistant d'Étude",
      welcome: "Salut ! Je suis Cognos. Posez-moi des questions.",
      thinking: "Réflexion...",
      placeholder: "Posez une question...",
      error: "Désolé, une erreur s'est produite."
    },
    nav: {
      dashboard: "Tableau de bord",
      uploadNew: "Nouveau fichier"
    }
  },
  de: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: Offline-Lernbegleiter",
    uploadDesc: "Laden Sie Ihr Material hoch. Funktioniert komplett offline.",
    uploadBtn: "Datei hochladen",
    formatAlert: "Nur PDF-, Word- und TXT-Dateien werden akzeptiert.",
    or: "ODER",
    pastePlaceholder: "Fügen Sie Ihren Text hier ein...",
    dashboardWelcome: "Willkommen zurück",
    studying: "Aktuell wird gelernt:",
    settingsTitle: "KI-Einstellungen",
    settingsDesc: "Diese App funktioniert offline. Für erweiterte KI (Gemini) geben Sie Ihren API-Schlüssel ein.",
    saveKey: "Speichern & KI Aktivieren",
    tools: {
      quiz: { title: "Interaktives Quiz", desc: "Testen Sie Ihr Wissen mit automatisch generierten Fragen." },
      flashcards: { title: "Smarte Lernkarten", desc: "Merken Sie sich Schlüsselkonzepte effektiv." },
      plan: { title: "Adaptiver Lernplan", desc: "Erhalten Sie einen strukturierten 4-Wochen-Plan." },
      simplify: { title: "Zusammenfassung", desc: "Erhalten Sie eine Zusammenfassung der wichtigsten Konzepte." }
    },
    quiz: {
      noData: "Noch kein Quiz generiert.",
      generate: "Quiz generieren",
      generating: "Generiere...",
      completed: "Quiz beendet!",
      youGot: "Sie haben",
      correct: "richtig",
      retry: "Wiederholen",
      new: "Neues Quiz",
      question: "Frage",
      score: "Punktzahl",
      explanation: "Erklärung:",
      next: "Weiter",
      finish: "Beenden"
    },
    flashcards: {
      noData: "Noch keine Lernkarten.",
      generate: "Karten generieren",
      creating: "Erstelle...",
      card: "Karte",
      question: "Frage",
      answer: "Antwort",
      clickFlip: "Klicken zum Umdrehen",
      showQuestion: "Frage anzeigen",
      showAnswer: "Antwort anzeigen",
      newDeck: "Neues Deck generieren"
    },
    plan: {
      noData: "Noch kein Lernplan.",
      create: "Plan erstellen",
      designing: "Entwerfe...",
      goal: "Ziel:",
      week: "Woche",
      hours: "Stunden",
      priority: "Priorität",
      regenerate: "Plan regenerieren",
      refining: "Verfeinere..."
    },
    simplify: {
      title: "Zusammenfassung",
      analyzing: "Analysiere...",
      placeholder: "Klicken Sie auf Regenerieren.",
      regenerate: "Regenerieren"
    },
    chat: {
      title: "Lernassistent",
      welcome: "Hallo! Ich bin Cognos. Fragen Sie mich etwas.",
      thinking: "Denken...",
      placeholder: "Stellen Sie eine Frage...",
      error: "Entschuldigung, ein Fehler ist aufgetreten."
    },
    nav: {
      dashboard: "Dashboard",
      uploadNew: "Neu hochladen"
    }
  },
  pt: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: Companheiro de Estudo Offline",
    uploadDesc: "Envie seu material de estudo. Funciona totalmente offline.",
    uploadBtn: "Enviar Arquivo",
    formatAlert: "Apenas arquivos PDF, Word e TXT são aceitos.",
    or: "OU",
    pastePlaceholder: "Cole seu texto aqui...",
    dashboardWelcome: "Bem-vindo de volta",
    studying: "Estudando atualmente:",
    settingsTitle: "Configurações de IA",
    settingsDesc: "Este app funciona offline. Para ativar a IA avançada (Gemini), insira sua chave API.",
    saveKey: "Salvar e Ativar IA",
    tools: {
      quiz: { title: "Quiz Interativo", desc: "Teste seu conhecimento com perguntas autogeradas." },
      flashcards: { title: "Flashcards Inteligentes", desc: "Memorize conceitos-chave com recordação ativa." },
      plan: { title: "Plano de Estudo Adaptativo", desc: "Obtenha um cronograma estruturado de 4 semanas." },
      simplify: { title: "Resumo", desc: "Obtenha um resumo dos conceitos mais importantes." }
    },
    quiz: {
      noData: "Nenhum quiz gerado ainda.",
      generate: "Gerar Quiz",
      generating: "Gerando...",
      completed: "Quiz Concluído!",
      youGot: "Você acertou",
      correct: "questões",
      retry: "Tentar Novamente",
      new: "Novo Quiz",
      question: "Questão",
      score: "Pontuação",
      explanation: "Explicação:",
      next: "Próximo",
      finish: "Finalizar"
    },
    flashcards: {
      noData: "Nenhum flashcard gerado ainda.",
      generate: "Gerar Flashcards",
      creating: "Criando Baralhos...",
      card: "Cartão",
      question: "Pergunta",
      answer: "Resposta",
      clickFlip: "Clique para virar",
      showQuestion: "Mostrar Pergunta",
      showAnswer: "Mostrar Resposta",
      newDeck: "Gerar Novo Baralho"
    },
    plan: {
      noData: "Nenhum plano de estudo gerado.",
      create: "Criar Plano",
      designing: "Projetando...",
      goal: "Meta:",
      week: "Semana",
      hours: "horas",
      priority: "Prioridade",
      regenerate: "Regenerar Plano",
      refining: "Refinando..."
    },
    simplify: {
      title: "Resumo",
      analyzing: "Analisando...",
      placeholder: "Clique em regenerar para ver o resumo.",
      regenerate: "Regenerar"
    },
    chat: {
      title: "Assistente de Estudo",
      welcome: "Olá! Sou o Cognos. Pergunte-me qualquer coisa.",
      thinking: "Pensando...",
      placeholder: "Faça uma pergunta...",
      error: "Desculpe, encontrei um erro."
    },
    nav: {
      dashboard: "Painel",
      uploadNew: "Enviar Novo"
    }
  },
  zh: {
    appTitle: "Cognos",
    uploadTitle: "Cognos: 离线学习伴侣",
    uploadDesc: "上传您的学习资料。完全离线工作。",
    uploadBtn: "上传文件",
    formatAlert: "仅接受 PDF、Word 和 TXT 文件。",
    or: "或",
    pastePlaceholder: "在此粘贴您的文本内容...",
    dashboardWelcome: "欢迎回来",
    studying: "当前学习：",
    settingsTitle: "AI 设置",
    settingsDesc: "此应用程序默认离线工作。要启用高级 AI 功能（由 Gemini 提供支持），请输入您的 API 密钥。",
    saveKey: "保存并启用 AI",
    tools: {
      quiz: { title: "互动测验", desc: "通过自动生成的问题测试您的知识。" },
      flashcards: { title: "智能抽认卡", desc: "通过主动回忆卡片记忆关键概念。" },
      plan: { title: "自适应学习计划", desc: "根据您的材料获取为期 4 周的结构化时间表。" },
      simplify: { title: "内容摘要", desc: "获取最重要概念的摘要。" }
    },
    quiz: {
      noData: "尚未生成测验。",
      generate: "生成测验",
      generating: "生成中...",
      completed: "测验完成！",
      youGot: "您答对了",
      correct: "题",
      retry: "重试",
      new: "新测验",
      question: "问题",
      score: "得分",
      explanation: "解释：",
      next: "下一题",
      finish: "完成"
    },
    flashcards: {
      noData: "尚未生成抽认卡。",
      generate: "生成抽认卡",
      creating: "创建中...",
      card: "卡片",
      question: "问题",
      answer: "答案",
      clickFlip: "点击翻转",
      showQuestion: "显示问题",
      showAnswer: "显示答案",
      newDeck: "生成新卡组"
    },
    plan: {
      noData: "尚未生成学习计划。",
      create: "创建学习计划",
      designing: "设计中...",
      goal: "目标：",
      week: "第几周",
      hours: "小时",
      priority: "优先级",
      regenerate: "重新生成计划",
      refining: "优化中..."
    },
    simplify: {
      title: "摘要",
      analyzing: "正在分析...",
      placeholder: "点击重新生成以查看摘要。",
      regenerate: "重新生成"
    },
    chat: {
      title: "学习助手",
      welcome: "你好！我是 Cognos。有关笔记的任何问题都可以问我。",
      thinking: "思考中...",
      placeholder: "提出问题...",
      error: "抱歉，我遇到了错误。"
    },
    nav: {
      dashboard: "仪表板",
      uploadNew: "上传新文件"
    }
  }
};
