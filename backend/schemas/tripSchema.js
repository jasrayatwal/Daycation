const { z } = require('zod');

const ActivitySchema = z.object({
  title: z.string().min(1).max(255),
  orderNumber: z.number().min(1),
  type: z.enum(['place', 'meal', 'event', 'transport', 'break', 'shopping', 'outdoor', 'cultural', 'history', 'custom']),
  address: z.string().min(1).max(500),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  startTime: z.string().min(8).max(8),
  endTime: z.string().min(8).max(8).optional(),
  durationMin: z.number().min(5).max(480).optional(),
  transportType: z.enum(['walk', 'transit', 'drive', 'ridehail']).optional(),
  costEstimate: z.number().min(0).max(99999999.99).optional().default(0),
  notes: z.string().max(1000).optional()
})

const TripSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().min(10).max(10),
  location: z.string().min(1).max(255),
  refLat: z.number().min(-90).max(90),
  refLng: z.number().min(-180).max(180),
  startTime: z.string().min(8).max(8),
  endTime: z.string().min(8).max(8),
  groupSize: z.number().min(1).max(20).default(2),
  primaryTransportation: z.enum(['walking', 'public_transit', 'car', 'mixed']).default('mixed'),
  tripPace: z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
  budget: z.number().min(0).max(9999.99).default(0),
  tripType: z.enum(['family', 'friends', 'shopping', 'nature', 'foodie', 'adventure', 'cultural', 'history', 'romantic', 'custom']).default('custom'),
  notes: z.string().max(1000).optional(),
  activities: z.array(ActivitySchema).min(1).max(20),

  //generation
  estimatedDuration: z.string().optional(),
  budgetBreakdown: z.object({
    food: z.number().min(0),
    activities: z.number().min(0),
    transport: z.number().min(0),
    misc: z.number().min(0)
  }).optional()
})

module.exports = {
  TripSchema,
  ActivitySchema
}
