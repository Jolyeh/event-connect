import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
    categoryId: z.string().min(1, 'La catégorie est requise'),
    tagNames: z.array(z.string()).optional().default([]),

    // Date & heure
    dateStart: z.string().min(1, 'La date de début est requise'),
    timeStart: z.string().optional(),
    dateEnd: z.string().optional().nullable(),
    timeEnd: z.string().optional().nullable(),
    multiDay: z.boolean().optional().default(false),

    // Lieu
    isOnline: z.boolean().optional().default(false),
    onlineUrl: z.string().url('Lien de l\'événement en ligne invalide').optional().nullable(),
    venue: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    capacity: z.number().int().positive().optional().nullable(),

    // Médias
    gallery: z.array(z.string()).optional().default([]),

    // Billetterie
    isFree: z.boolean().optional().default(false),
    saleStart: z.string().optional().nullable(),
    saleEnd: z.string().optional().nullable(),

    // Tickets (optionnel à la création)
    tickets: z.array(z.object({
        name: z.string().min(1, 'Le nom du billet est requis'),
        description: z.string().optional(),
        price: z.number().int().min(0, 'Le prix doit être positif'),
        quantity: z.number().int().positive('La quantité doit être positive'),
    })).optional().default([]),

    // Options
    ageRestriction: z.string().optional().nullable(),
    contactEmail: z.string().email('Email invalide').optional().nullable(),
    website: z.string().url('URL invalide').optional().nullable(),
}).superRefine((data, ctx) => {
    if (data.isOnline && !data.onlineUrl) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'URL est requise pour un événement en ligne", path: ['onlineUrl'] });
    }
    if (!data.isOnline && !data.venue) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le lieu est requis pour un événement physique', path: ['venue'] });
    }
    if (!data.isOnline && !data.city) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ville est requise pour un événement physique', path: ['city'] });
    }
    if (!data.isFree && data.tickets.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Au moins un type de billet est requis pour un événement payant', path: ['tickets'] });
    }
});

export const changeStatusSchema = z.object({
    status: z.enum(['PENDING', 'PUBLISHED', 'CANCELLED', 'COMPLETED'], {
        errorMap: () => ({ message: 'Statut invalide. Valeurs acceptées : PENDING, PUBLISHED, CANCELLED, COMPLETED' }),
    }),
});