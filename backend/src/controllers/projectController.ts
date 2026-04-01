import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProjectRepository } from '../repositories/projectRepository';

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await ProjectRepository.getAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { project_code, name, manager, status } = req.body;
        if (!project_code || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        let normalizedStatus = (status && status.toUpperCase() === 'INACTIVE') ? 'INACTIVE' : 'ACTIVE';
        
        const newProject = await ProjectRepository.create({ 
            project_code, 
            name, 
            manager,
            status: normalizedStatus as 'ACTIVE' | 'INACTIVE'
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
};
