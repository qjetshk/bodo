interface FeaturesCardsProps {
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt?: string;
}

export const FEATURES_CARDS: FeaturesCardsProps[] = [
  {
    title: "Совместная работа в реальном времени",
    desc: "Работайте над одной доской вместе — изменения участников видны мгновенно. Перетаскивание задач, добавление комментариев и редактирование карточек синхронизируются у всех пользователей",
    imageSrc: "https://i1.sndcdn.com/avatars-PTCtM3mZYft6ju1Z-9Er9sA-t240x240.jpg",
  },
  {
    title: "Гибкие доски и колонки",
    desc: "Создавайте доски под любые процессы — от проектного менеджмента до личных планов. Добавляйте, переименовывайте и настраивайте колонки, чтобы визуализировать ваш уникальный рабочий поток.",
    imageSrc: "https://i1.sndcdn.com/avatars-PTCtM3mZYft6ju1Z-9Er9sA-t240x240.jpg",
  },
  {
    title: "Карточки с контентом и метками",
    desc: "Каждая карточка — это мини-пространство для идей: добавляйте описания, чек-листы, комментарии и метки. Упрощайте приоритизацию и организацию задач.",
    imageSrc: "https://i1.sndcdn.com/avatars-PTCtM3mZYft6ju1Z-9Er9sA-t240x240.jpg",
  },
  {
    title: "Быстрое добавление задач",
    desc: "Добавляйте новые задачи за секунды прямо на доску. Просто кликните “+”, напишите название и карточка готова к работе.",
    imageSrc: "https://i1.sndcdn.com/avatars-PTCtM3mZYft6ju1Z-9Er9sA-t240x240.jpg",
  },
];
