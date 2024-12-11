import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects
router.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const projects = await prisma.project.findMany({
    include: {
      author: true,
      stages: true,
    },
  });
  res.json(projects);
}));

// Get a single project by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      stages: true,
    },
  });

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  res.json(project);
}));

// Create a new project (requires authentication)
router.post('/', requireAuth, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, techStack, repoUrls, imageUrl, documentation, youtubeUrl, stages } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Title and description are required' });
    return;
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      techStack: techStack || [],
      repoUrls: repoUrls || [],
      imageUrl: imageUrl || '',
      documentation: documentation || '',
      youtubeUrl,
      stages: {
        create: stages || [],
      },
      authorId: req.user.id,
    },
    include: {
      author: true,
      stages: true,
    },
  });

  res.status(201).json(project);
}));

// Update a project by ID (requires authentication)
router.put('/:id', requireAuth, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, techStack, repoUrls, imageUrl, documentation, youtubeUrl, stages } = req.body;

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      techStack,
      repoUrls,
      imageUrl,
      documentation,
      youtubeUrl,
      stages: {
        deleteMany: {},
        create: stages,
      },
    },
    include: {
      author: true,
      stages: true,
    },
  });

  res.json(project);
}));

// Delete a project by ID (requires authentication)
router.delete('/:id', requireAuth, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await prisma.project.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
}));

export const projectsRouter = router;