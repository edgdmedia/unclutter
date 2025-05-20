import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unclutter API Documentation',
      version,
      description: 'Documentation for the Unclutter mental wellness app API',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Unclutter Support',
        url: 'https://unclutter.com.ng',
        email: 'support@unclutter.com.ng',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Development server',
      },
      {
        url: 'https://api.unclutter.com.ng',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email is required',
                  },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
            },
            isVerified: {
              type: 'boolean',
            },
            profile: {
              $ref: '#/components/schemas/Profile',
            },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            firstName: {
              type: 'string',
              nullable: true,
            },
            lastName: {
              type: 'string',
              nullable: true,
            },
            displayName: {
              type: 'string',
              nullable: true,
            },
            bio: {
              type: 'string',
              nullable: true,
            },
            avatarUrl: {
              type: 'string',
              nullable: true,
            },
            preferences: {
              type: 'object',
            },
            enabledModules: {
              type: 'object',
              properties: {
                journal: {
                  type: 'boolean',
                },
                moodTracker: {
                  type: 'boolean',
                },
                planner: {
                  type: 'boolean',
                },
                expenseManager: {
                  type: 'boolean',
                },
                bookReader: {
                  type: 'boolean',
                },
              },
            },
            timezone: {
              type: 'string',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              format: 'password',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              format: 'password',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                    },
                    role: {
                      type: 'string',
                      enum: ['user', 'admin', 'therapist'],
                    },
                    isVerified: {
                      type: 'boolean',
                    },
                  },
                },
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
        // Therapy Module Schemas
        Therapist: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            bio: {
              type: 'string',
            },
            specialties: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            credentials: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            isActive: {
              type: 'boolean',
            },
            calendarIntegration: {
              type: 'object',
              properties: {
                provider: {
                  type: 'string',
                },
                calendarId: {
                  type: 'string',
                },
              },
            },
            meta: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Session: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            therapistId: {
              type: 'string',
              format: 'uuid',
            },
            clientId: {
              type: 'string',
              format: 'uuid',
            },
            startTime: {
              type: 'string',
              format: 'date-time',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'completed', 'canceled', 'rescheduled', 'no_show'],
            },
            type: {
              type: 'string',
              enum: ['initial', 'regular', 'follow_up', 'emergency'],
            },
            format: {
              type: 'string',
              enum: ['video', 'audio', 'chat', 'in_person', 'hybrid'],
            },
            privateNotes: {
              type: 'string',
            },
            sharedNotes: {
              type: 'string',
            },
            meta: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Form: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: ['assessment', 'intake', 'progress', 'feedback', 'custom'],
            },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['text', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date'],
                  },
                  required: {
                    type: 'boolean',
                  },
                  placeholder: {
                    type: 'string',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        label: {
                          type: 'string',
                        },
                        value: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
            isActive: {
              type: 'boolean',
            },
            meta: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FormResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            formId: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            sessionId: {
              type: 'string',
              format: 'uuid',
            },
            responses: {
              type: 'object',
            },
            meta: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Resource: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            therapistId: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: ['article', 'video', 'audio', 'worksheet', 'exercise', 'other'],
            },
            url: {
              type: 'string',
            },
            isPublic: {
              type: 'boolean',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            meta: {
              type: 'object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ResourceAssignment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            resourceId: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            note: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts', './src/controllers/*.ts', './src/controllers/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
