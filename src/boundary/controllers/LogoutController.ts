import DomainManager from "../../domain/DomainManager";
import Session from "../../utils/Session";
import SessionFactory from "../../utils/interfaces/SessionFactory";
import RestfulController from "./abstracts/RestfulController";
import RestfulControllerParam from "./interfaces/RestfulControllerParam";

export default class LogoutController extends RestfulController{
    
    //constructor
    public constructor(domainManager?: DomainManager |undefined){
        super(domainManager);
    }
    public async execute({request,response}: RestfulControllerParam): Promise<void> {
       //get session
       const session : Session = (request as any).session;
       const email: string = session.get("user");
        if(!session.get("user")){
            response.json(
                {
                    success: false,
                    message : "Not logged in!",
                    code :"NOT_LOGGED_IN"
                }
            );
            return;
            
        }

        const sessionFactory: SessionFactory = (request as any).sessionFactory;
        const allSession : Session[] = sessionFactory.getAll();

        for(const session of allSession) {
            if(session.get("user") === email) {
                session.remove("user");
            }
        }
       //

       response.json(
        {
            success : true
        }
       )
    }

}