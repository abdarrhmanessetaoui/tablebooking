import Sidebar from './Sidebar';


const Dashboard = () => {
    return (<>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      </>
    )
  }
  
  const Dashboard = () => {
    return (<>
      <div className="flex">
      <Sidebar />
      <div className="p-8 flex-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      </div>
      </>
    )
    }
    
  export default Dashboard