import { IProject } from "../interfaces/iProject";
import { Project } from "../model/project";
import { GETHEADERS, HOSTNAME, POSTHEADERS, PROJECTS, SUBJECTPROJECTS, USERPROJECTS } from "../parameters/database";
import { errorHandling } from "../util/error";

import '../util/yymmdd';

export async function fetchProjects() {
    return await fetch(HOSTNAME + PROJECTS, GETHEADERS())
    .then(response => {
        if(!response.ok)
            throw new Error(JSON.stringify(response.status))
        else
            return response.json()
    })
    .then((projects: IProject[]) => {
        const returnedProjects: Project[] = []
        for(const project of projects){
            project.deadline = new Date(project.deadline) // .toLocaleString('el-GR', { timeZone: 'UTC' })
            returnedProjects.push(new Project(project))
        }
            
    
        return returnedProjects
    })
    .catch((error) => {
        errorHandling(error)
        return null
    });
}

export async function fetchProject(id: number) {
    return await fetch(HOSTNAME + PROJECTS + "/" + id, GETHEADERS())
    .then(response => {
        if(!response.ok)
            throw new Error(JSON.stringify(response.status))
        else
            return response.json()
    })
    .then((project: IProject) => {
        project.deadline = new Date(project.deadline) // .toLocaleString('el-GR', { timeZone: 'UTC' })
        return new Project(project)
    })
    .catch((error) => {
        errorHandling(error)
        return null
    });
}

export async function fetchUserProjects(userID: number) {
    return await fetch(HOSTNAME + USERPROJECTS + "/" + userID, GETHEADERS())
    .then(response => {
        if(!response.ok)
            throw new Error(JSON.stringify(response.status))
        else
            return response.json()
    })
    .then((userProjects: IProject[]) => {
        const returnedProjects: Project[] = []
        for(const project of userProjects){
            project.deadline = new Date(project.deadline) // .toLocaleString('el-GR', { timeZone: 'UTC' })
            returnedProjects.push(new Project(project))
        }
    
        return returnedProjects
    })
    .catch((error) => {
        errorHandling(error)
        return null
    });
}

export async function fetchSubjectProjects(subjectID: number) {
    return await fetch(HOSTNAME + SUBJECTPROJECTS + "/" + subjectID, GETHEADERS())
    .then(response => {
        if(!response.ok)
            throw new Error(JSON.stringify(response.status))
        else
            return response.json()
    })
    .then((userProjects: IProject[]) => {
        const returnedProjects: Project[] = []
        for(const project of userProjects){
            project.deadline = new Date(project.deadline) // .toLocaleString('el-GR', { timeZone: 'UTC' })
            returnedProjects.push(new Project(project))
        }

        return returnedProjects
    })
    .catch((error) => {
        errorHandling(error)
        return null
    });
}

export async function postProject(project: Project) {
    const response: boolean | void = await fetch(HOSTNAME + PROJECTS, POSTHEADERS(project))
    .then(response => {
        if(!response.ok) throw new Error(JSON.stringify(response.status));
        else return response.ok;
    })
    .catch((error) => {
        errorHandling(error)
    });

    return response
}
