import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ReactDropdown from "react-dropdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileUpload from "../components/fileUpload";
import { fetchAndSetupUser } from "../api/helpers/massSetups";
import { ProjectModel } from "../model/ProjectModel";
import { UserModel } from "../model/UserModel";
import { fetchTokenID } from "../api/tokenApi";
import { ProjectEntry } from "../components/pageComponents";
import { PageButtonDescription } from "../components/pageComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [user, setUser] = useState<UserModel>()

  const [selectedProject, setSelectedProject] = useState<ProjectModel>()
  
  const [rerender, setRerender] = useState<number>(0)

  const [filterOptions, setFilterOptions] = useState<{value: string, label: string}[]>([{value: "unsubmitted", label: "Unsubmitted Projects"}])  // my = my projects, supervising = for profs and admins
  const [filter, setFilter] = useState<string>("")
  const [filteredProjects, setFilteredProjects] = useState<ProjectModel[]>([])

  const [filterGrades, setFilterGrades] = useState<number>(0) // -1 negative, 0 neutral, 1 positive
  const [filterDeadline, setFilterDeadline] = useState<number>(0) // -1 negative, 0 neutral, 1 positive
  
  useEffect(() => {
    const fetchData = async () => {
      const tokenID: number | null = await fetchTokenID()

      if(tokenID){
        const userOBJ: UserModel | null = await fetchAndSetupUser(tokenID)
        userOBJ && setUser(userOBJ)
        if(userOBJ && userOBJ.role < 1)
          setFilterOptions([ ...filterOptions, 
            { value: "supervising", label: "Supervising Projects" }
          ])
        else
          setFilterOptions([ ...filterOptions, 
            {value: "submitted", label: "Submitted Projects"},
            {value: "ungraded", label: "Ungraded Projects"},
            {value: "graded", label: "Graded Projects"},
            {value: "all", label: "All Projects"}
          ])
      }

      setFilter(filterOptions[0].value)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if(user){
      const parsedID: string = (params.get('id') === null) ? "" : params.get('id')!.toString()
      for(const project of user.getProjects())
        if(project.id === parseInt(parsedID)){
          setSelectedProject(project)
          break;
        }
    }
}, [rerender, user])

  useEffect(() => {
    if(user){
      if (filter === "unsubmitted")
        setFilteredProjects(user.getProjects({filterSubmitted: -1, filterDeadline: filterDeadline, filterGrades: filterGrades}))
      else if (filter === "submitted")
        setFilteredProjects(user.getProjects({filterSubmitted: 1, filterDeadline: filterDeadline, filterGrades: filterGrades}))
      else if (filter === "all")
        setFilteredProjects(user.getProjects())
      else if (filter === "supervising")
        setFilteredProjects([])
    }
  }, [filter, filterDeadline, filterGrades])

  const changeFilterGrade = () => {
    if(filterGrades == 1)
      setFilterGrades(-1)
    else
      setFilterGrades(filterGrades+1)
  }

  const changeFilterDeadline = () => {
    if(filterDeadline == 1)
      setFilterDeadline(-1)
    else
      setFilterDeadline(filterDeadline+1)
  }

  return (
    <div className="page column">
      <div className="top-header text row">
        {user && user.role <= 1 ? <>
          <button className="button" style={{flex: 1, padding: 5, borderRadius: 2}} onClick={() => navigate('/new-project')}>New Project</button>
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
          <div className="text row center header-title">
              <ReactDropdown
                controlClassName="row center"
                menuClassName="dropdown-menu"        
                options={filterOptions}
                onChange={(option) => {setFilter(option.value);}}
                value={filterOptions[0].label}
                placeholder={filter}
                arrowClosed={<KeyboardArrowDown/>}
                arrowOpen={<KeyboardArrowUp/>}
                className="dropdown-menu-root"
                baseClassName="center column dropdown-menu "
              />
              <button className="filter-button icon-button-small" title={"Filter by grades"} style={filterGrades == -1 ? {color: "firebrick"} : filterGrades == 1 ? {color: "green"} : {color: "black"}} type="button" onClick={() => changeFilterGrade()}>
                <FontAwesomeIcon icon={faStar} />
              </button>
              <button className="filter-button icon-button-small" title={"Filter by deadline"} style={filterDeadline == -1 ? {color: "firebrick"} : filterDeadline == 1 ? {color: "green"} : {color: "black"}} type="button" onClick={() => changeFilterDeadline()}>
                <FontAwesomeIcon icon={faClock} />
              </button>
          </div>
          <div className="column" style={{overflow:'scroll'}}>
            {filteredProjects.map((project, index) => (
              <button key={index} className="list-button"
                onClick={() => {navigate('/projects?id=' + project.id); setRerender(rerender+1)}}
              >
                <PageButtonDescription component={project} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="column container" style={{flex: 1, justifyContent:"space-between"}}>
            {selectedProject && selectedProject.id === -1 ? <></> : <>
              {selectedProject && <ProjectEntry project={selectedProject && selectedProject} userRole={user?.role} />}
              <div className="center">
                {selectedProject && <>
                  {user && user.role > 1 ? <>
                    {user.hasProject(selectedProject.id) ?
                      <FileUpload user={user} project={selectedProject} />
                    :
                      <div className="list-button text">You can not upload a submission because you have not joined this subject.</div>
                    }
                  </>:
                    <button className="list-button" onClick={() => {navigate('/submissions?project=' + selectedProject.id, {state: {project: selectedProject}})}} style={{margin: "20px"}}>See Submissions</button>
                  }
                </>}
              </div>
            </>}
        </div>
      </div>
    </div>
  );
}
