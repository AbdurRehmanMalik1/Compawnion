/**
 * @swagger
 * /api/pets:
 *   post:
 *     tags:
 *       - Pets
 *     summary: Add a new pet
 *     description: Add a new pet to the shelter's collection
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - gender
 *               - images
 *               - healthDetails
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the pet
 *                 example: Max
 *               species:
 *                 type: string
 *                 enum: [dog, cat, bird, rabbit, other]
 *                 description: Species of the pet
 *                 example: dog
 *               breed:
 *                 type: string
 *                 description: Breed of the pet
 *                 example: Golden Retriever
 *               age:
 *                 type: object
 *                 required:
 *                   - value
 *                   - unit
 *                 properties:
 *                   value:
 *                     type: number
 *                     description: Age value
 *                     example: 2
 *                   unit:
 *                     type: string
 *                     enum: [days, months, years]
 *                     description: Age unit
 *                     example: years
 *               gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *                 description: Gender of the pet
 *                 example: male
 *               size:
 *                 type: string
 *                 enum: [small, medium, large, extra-large]
 *                 description: Size of the pet
 *                 example: medium
 *               color:
 *                 type: string
 *                 description: Color of the pet
 *                 example: Golden
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: URLs of pet images
 *                 example: ["https://example.com/pet1.jpg", "https://example.com/pet2.jpg"]
 *               description:
 *                 type: string
 *                 description: Description of the pet
 *                 example: A friendly and playful dog who loves to play fetch
 *               adoptionStatus:
 *                 type: string
 *                 enum: [available, pending, adopted]
 *                 description: Current adoption status
 *                 example: available
 *               adoptionFee:
 *                 type: number
 *                 description: Fee for adopting the pet
 *                 example: 200
 *               healthDetails:
 *                 type: object
 *                 required:
 *                   - isVaccinated
 *                   - isNeutered
 *                 properties:
 *                   isVaccinated:
 *                     type: boolean
 *                     description: Whether the pet is vaccinated
 *                     example: true
 *                   isNeutered:
 *                     type: boolean
 *                     description: Whether the pet is neutered
 *                     example: true
 *                   medicalHistory:
 *                     type: string
 *                     description: Medical history of the pet
 *                     example: Regular checkups, no major health issues
 *     responses:
 *       201:
 *         description: Pet added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pet added successfully
 *                 pet:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     species:
 *                       type: string
 *                     breed:
 *                       type: string
 *                     age:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                         unit:
 *                           type: string
 *                     gender:
 *                       type: string
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *                     adoptionStatus:
 *                       type: string
 *                     adoptionFee:
 *                       type: number
 *                     healthDetails:
 *                       type: object
 *                       properties:
 *                         isVaccinated:
 *                           type: boolean
 *                         isNeutered:
 *                           type: boolean
 *                         medicalHistory:
 *                           type: string
 *                     shelterId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */

/**
 * @swagger
 * /api/pets/shelter:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Get all pets of a shelter with optional filters
 *     description: Retrieve all pets belonging to the authenticated shelter with optional filtering by search term, species, gender, color, breed, age, adoption status, and adoption fee
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to match against pet name or description (case-insensitive partial match)
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [dog, cat, bird, rabbit, other]
 *         description: Filter by pet species
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, unknown]
 *         description: Filter by pet gender
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by pet color (case-insensitive partial match)
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by pet breed (case-insensitive partial match)
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: number
 *         description: Minimum age for filtering
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: number
 *         description: Maximum age for filtering
 *       - in: query
 *         name: ageUnit
 *         schema:
 *           type: string
 *           enum: [days, months, years]
 *         description: Unit for age range (days, months, years)
 *       - in: query
 *         name: adoptionStatus
 *         schema:
 *           type: string
 *           enum: [available, pending, adopted]
 *         description: Filter by adoption status
 *       - in: query
 *         name: minAdoptionFee
 *         schema:
 *           type: number
 *         description: Minimum adoption fee for filtering
 *       - in: query
 *         name: maxAdoptionFee
 *         schema:
 *           type: number
 *         description: Maximum adoption fee for filtering
 *     responses:
 *       200:
 *         description: List of pets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pets retrieved successfully
 *                 pets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized - User not authenticated or not a shelter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/pets/search:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Search for pets across all shelters
 *     description: Search for pets with optional filters including location-based search and shelter name search
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to match against pet name, description, or shelter name (case-insensitive partial match)
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [dog, cat, bird, rabbit, other]
 *         description: Filter by pet species
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, unknown]
 *         description: Filter by pet gender
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by pet color (case-insensitive partial match)
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by pet breed (case-insensitive partial match)
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: number
 *         description: Minimum age for filtering
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: number
 *         description: Maximum age for filtering
 *       - in: query
 *         name: ageUnit
 *         schema:
 *           type: string
 *           enum: [days, months, years]
 *         description: Unit for age range (days, months, years)
 *       - in: query
 *         name: adoptionStatus
 *         schema:
 *           type: string
 *           enum: [available, pending, adopted]
 *         description: Filter by adoption status
 *       - in: query
 *         name: minAdoptionFee
 *         schema:
 *           type: number
 *         description: Minimum adoption fee for filtering
 *       - in: query
 *         name: maxAdoptionFee
 *         schema:
 *           type: number
 *         description: Maximum adoption fee for filtering
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: "-73.935242,40.730610"
 *         description: Location coordinates (longitude,latitude) for radius search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           example: 10
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of pets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pets retrieved successfully
 *                 pets:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Pet'
 *                       - type: object
 *                         properties:
 *                           shelterId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               roleData:
 *                                 type: object
 *                                 properties:
 *                                   shelterName:
 *                                     type: string
 *                                   address:
 *                                     type: string
 *                                   phone:
 *                                     type: string
 */

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Get a single pet by ID
 *     description: Retrieve detailed information about a specific pet
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pet to retrieve
 *     responses:
 *       200:
 *         description: Pet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pet retrieved successfully
 *                 pet:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Pet'
 *                     - type: object
 *                       properties:
 *                         shelterId:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             roleData:
 *                               type: object
 *                               properties:
 *                                 shelterName:
 *                                   type: string
 *                                 address:
 *                                   type: string
 *                                 phone:
 *                                   type: string
 */
