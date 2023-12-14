import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileUpload from "../components/fileUpload";
import { fetchProjects } from "../api/projectsApi";
import { fetchAndSetupProjects, fetchAndSetupUser } from "../api/helpers/massSetups";
import { ProjectModel } from "../model/ProjectModel";
import { UserModel } from "../model/UserModel";
import { fetchTokenID, fetchTokenRole } from "../api/tokenApi";

export default function ProjectsPage() {

  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [projects, setProjects] = useState<ProjectModel[]>([new ProjectModel()])
  const [selectedProject, setSelectedProject] = useState<ProjectModel>(new ProjectModel())

  
  const [user, setUser] = useState<UserModel>(new UserModel())

  const [rerender, setRerender] = useState<number>(0)

  const [userRole, setUserRole] = useState<number>(3)

  const filterOptions = [
    {value: "my", label: "My Projects"},
    {value: "available", label: "Available Projects"},
    {value: "all", label: "All Projects"},
    {value: "supervising", label: "Supervising Projects"}]  // my = my projects, all = all projects, supervising = for profs and admins
  const [filter, setFilter] = useState<string>("")
  const [filteredProjects, setFilteredProjects] = useState<ProjectModel[]>([new ProjectModel()])
  
  useEffect(() => {
    const fetchData = async () => {
      const projectsOBJ: ProjectModel[] | null = (userRole <= 1) ? await fetchAndSetupProjects() : await fetchProjects()
      
      if(projectsOBJ){
        setProjects(projectsOBJ)
        const parsedID: string = (params.get('id') === null) ? "" : params.get('id')!.toString()
        for(const project of projectsOBJ){
          if(project.id === parseInt(parsedID)){
            setSelectedProject(project)
            break;
          }
        } 
      }
    }

    fetchData()
  }, [rerender, userRole])

  useEffect(() => {
    const fetchRole = async () => {
      const role: number | null = await fetchTokenRole()
      if(role != null)
        setUserRole(role)
    }
    fetchRole()
  }, [userRole])

  useEffect(() => {
    const fetchData = async () => {
      const tokenID: number | null = await fetchTokenID()

      if(tokenID){
        const userOBJ: UserModel | null = await fetchAndSetupUser(tokenID)
        userOBJ && setUser(userOBJ)
      }

      setFilter(filterOptions[0].value)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (filter === "my")
      setFilteredProjects(user.getProjects())
    else if (filter === "available")
      setFilteredProjects(projects.filter(project => !user.getProjects().map(project => project.id).includes(project.id))) //get user project' ids and if they are included in the total projects list, filter them out
    else if (filter === "all")
      setFilteredProjects(projects)
    else if (filter === "supervising")
      setFilteredProjects([])

  }, [filter])

  return (
    <div className="page column" style={{overflow: 'hidden'}}>
      <div className="header-title row">
        {userRole <= 1 ? <>
          <button style={{flex: 1, padding: 5, borderRadius: 2}} onClick={() => navigate('/new-project')}>New Project</button>
        </> : <div style={{flex: 1}}></div>}
        <div className="text center column" style={{flex: 4}}>
          <div>This is a list of all the projects. You can participate in all the projects whose subjects you follow.</div>
          <div className="row">
            <div>There are pending projects from subjects.</div>
          </div>
        </div>
        <div style={{flex: 1}}></div>
      </div>
      <div className="row"  style={{flex: 6}}>
        <div className="column container" style={{flex: 0.8}}>
          <div className="text center header-title">
            <ReactDropdown
              controlClassName="row center"
              menuClassName="dropdown-menu"        
              options={filterOptions}
              onChange={(option) => {setFilter(option.value);}}
              value={"My Projects"}
              placeholder={filter}
              arrowClosed={<KeyboardArrowDown/>}
              arrowOpen={<KeyboardArrowUp/>}
            />
          </div>
          <div className="column" style={{overflow:'scroll'}}>
            {filteredProjects.map((project, index) => (
              <button key={index} className="button"
                onClick={() => {navigate('/projects?id=' + project.id); setRerender(rerender+1)}}
              >
                <div style={{backgroundColor:"transparent", justifyContent:"space-between"}} className="row center">
                  <span>{}</span>
                  <span>{project.name}</span>
                  {userRole <= 1 ? 
                    <span className={`grade-box ${project.averageGrade !== null ? (project.averageGrade >= 5 ? 'green-box' : 'red-box') : 'gray-box'}`}>
                      {project.averageGrade !== null ?
                        (project.averageGrade % 1 !== 0 ? project.averageGrade?.toFixed(1) : project.averageGrade) 
                      : " - "}
                    </span>
                  : <span></span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="column container" style={{flex: 1, padding:"10px", justifyContent:"space-between"}}>
            {selectedProject.id === -1 ? <></> : <>
            <div>
              <div className="center" style={{padding:"30px"}}>
                <div className="header-text">{selectedProject.name}</div>
                <div className="small-text">Deadline: {selectedProject.deadline.toLocaleString('el-GR', { timeZone: 'UTC' })}</div>
              </div>
              {userRole <= 1 ?
              <div className="center" style={{padding:"10px"}}>
                <div className="small-text">
                  <span>Project Average Grade: </span>
                  <span className={`grade-box ${selectedProject.averageGrade !== null ? (selectedProject.averageGrade >= 5 ? 'green-box' : 'red-box') : 'gray-box'}`}>
                    {selectedProject.averageGrade !== null ?
                      (selectedProject.averageGrade % 1 !== 0 ? selectedProject.averageGrade?.toFixed(1) : selectedProject.averageGrade) 
                    : " - "}
                  </span>
                </div>
              </div>
              :<></>}
              <div style={{margin: "20px"}}>
                <div className="large-text center">Project Description</div>
                <div className="small-text">{selectedProject.description}</div>
              </div>
            </div>
            {user.hasProject(selectedProject.id) ?
              <FileUpload user={user} pID={selectedProject.id} />
            :
              <div className="button">You can not upload a submission for a subject you are not joined. Please join subject and try again.</div>
            }
            
            
            {userRole <= 1 ? <>
              <button className="button" onClick={() => {navigate('/submissions?project=' + selectedProject.id, {state: {project: selectedProject}})}} style={{margin: "20px"}}>See Submissions</button>
            </> : <></>}
            </>}
        </div>
      </div>
    </div>
  );
}