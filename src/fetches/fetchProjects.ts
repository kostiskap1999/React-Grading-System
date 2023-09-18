import { IProjectExtraData } from "../interfaces/iProject";
import { Project } from "../model/project";
import { errorHandling } from "../util/error";

import '../util/yymmdd'

export async function fetchProjects() {
    const projects: Project[] = await fetch("mock/projectsMock.json")
    .then(response => {
        if(!response.ok) throw new Error(JSON.stringify(response.status));
        else return response.json();
    })
    .catch((error) => {
        errorHandling(error)
    });

    var returnedProjects: Project[] = []
    for(const project of projects){
        project.deadline = project.deadline.toLocaleString('el-GR', { timeZone: 'UTC' })
        returnedProjects.push(new Project(project))
    }
        

    return returnedProjects
}

export async function fetchProjectsExtraData() {
    const projectsExtraData: IProjectExtraData[] = await fetch("mock/projectsExtraDataMock.json")
    .then(response => {
        if(!response.ok) throw new Error(JSON.stringify(response.status));
        else return response.json();
    })
    .catch((error) => {
        errorHandling(error)
    });

    return projectsExtraData
}
