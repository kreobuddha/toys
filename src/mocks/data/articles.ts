import type { IArticle } from '@/api/types';

const cover = (seed: string): string => `https://picsum.photos/seed/${seed}/1200/675`;

const paragraphs = (...items: string[]): string => items.map((p) => `<p>${p}</p>`).join('');

export const articles: IArticle[] = [
  {
    id: 1,
    slug: 'why-open-ended-toys-matter',
    title: 'Why open-ended toys matter',
    excerpt:
      'Blocks, scarves and wooden rings have no single right way to play. That is exactly what makes them powerful.',
    cover: cover('article-open-ended'),
    publishedAt: '2026-08-28',
    blocks: [
      {
        type: 'text',
        html: paragraphs(
          'An open-ended toy is one without a fixed outcome. A set of blocks can be a tower, a road, a zoo or a phone. The child decides, and the decision changes every day.',
          'Research on play consistently links this kind of freedom with stronger executive function: planning, holding a goal in mind, and adjusting when something does not work.'
        ),
      },
      {
        type: 'image',
        src: cover('article-blocks'),
        alt: 'Wooden blocks on a rug',
        caption: 'A basic block set covers years of play.',
      },
      {
        type: 'quote',
        text: 'The toy should do 10 percent of the work and the child 90 percent.',
        author: 'A rule of thumb we like',
      },
      {
        type: 'text',
        html: paragraphs(
          'This is also why second-hand open-ended toys are such a good deal. A scuffed block is still a block. A stacking ring with a chipped edge still stacks.',
          'When you pick one from our <strong>catalog</strong>, look for sets with many pieces of the same kind. Variety within a set matters less than quantity.'
        ),
      },
    ],
  },
  {
    id: 2,
    slug: 'choosing-toys-by-age',
    title: 'Choosing toys by age, without overthinking it',
    excerpt:
      'Age labels on boxes are about safety, not development. Here is a simpler way to match a toy to a child.',
    cover: cover('article-age'),
    publishedAt: '2026-08-14',
    blocks: [
      {
        type: 'text',
        html: paragraphs(
          'The number on the box tells you the toy has no small parts for that age. It does not tell you whether the child will enjoy it.',
          'A better signal is what the child is currently practising: grasping, stacking, sorting, pretending, building with rules.'
        ),
      },
      {
        type: 'text',
        html: `<ul><li><strong>0–1:</strong> textures, rattles, things to mouth and drop.</li><li><strong>1–3:</strong> stacking, posting, push-and-pull, first puzzles.</li><li><strong>3–5:</strong> pretend play, simple construction, matching games.</li><li><strong>5–8:</strong> rule-based games, marble runs, craft kits.</li></ul>`,
      },
      {
        type: 'image',
        src: cover('article-sorter'),
        alt: 'Shape sorter cube',
        caption: 'Posting toys are the classic 1–3 pick.',
      },
    ],
  },
  {
    id: 3,
    slug: 'how-we-restore-toys',
    title: 'How we restore toys before they reach you',
    excerpt:
      'Every toy we sell is cleaned, checked and, where needed, repaired. Here is the process.',
    cover: cover('article-restore'),
    publishedAt: '2026-07-30',
    blocks: [
      {
        type: 'text',
        html: paragraphs(
          'Toys arrive in boxes from families whose children have outgrown them. The first step is sorting: complete sets, sets missing a piece, and toys that will not make it.',
          'Wooden toys are washed, sanded where the finish is worn, and re-oiled. Plastic is washed at high temperature. Fabric goes through a hot wash.'
        ),
      },
      {
        type: 'quote',
        text: 'Good enough to give to a friend is our bar for every item.',
      },
      {
        type: 'text',
        html: paragraphs(
          'Each listing states the condition honestly: like new, very good or good. The photos are of the actual item, not a stock image.'
        ),
      },
    ],
  },
  {
    id: 4,
    slug: 'a-small-toy-rotation',
    title: 'A small toy rotation that actually works',
    excerpt: 'Fewer toys out at once means deeper play. A rotation of two boxes is enough.',
    cover: cover('article-rotation'),
    publishedAt: '2026-07-12',
    blocks: [
      {
        type: 'text',
        html: paragraphs(
          'Put roughly a third of the toys on the shelf and the rest in two boxes in a cupboard. Every two weeks, swap one box.',
          'Old toys feel new again, the room is easier to tidy, and you notice which toys never get chosen. Those are the ones to pass on.'
        ),
      },
    ],
  },
];
