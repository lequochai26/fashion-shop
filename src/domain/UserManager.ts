import PersistenceHandler from "../persistence/PersistenceHandler";
import UserData from "../persistence/data/UserData";
import CartItemPrimaryKey from "../persistence/pkeys/CartItemPrimaryKey";
import VerificationCodePrimaryKey from "../persistence/pkeys/VerificationCodePrimaryKey";
import ReversableConverter from "../utils/interfaces/ReversableConverter";
import EntityManager from "./EntityManager";
import PersistenceHandlerHolder from "./PersistenceHandlerHolder";
import CartItem from "./entities/CartItem";
import Order from "./entities/Order";
import User from "./entities/User";
import VerificationCode from "./entities/VerificationCode";

export default class UserManager extends PersistenceHandlerHolder implements EntityManager<User,string> {
    //Fields: 
    private userConverter?: ReversableConverter<UserData, User> | undefined;
    
    private orderManager?: EntityManager<Order, string> | undefined;
    private cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined;
    private verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined;
    

    //Constructor:
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        userConverter?: ReversableConverter<UserData,User> | undefined,
        orderManager?: EntityManager<Order,string> | undefined,
        cartItemManager?: EntityManager<CartItem,CartItemPrimaryKey> | undefined,
        verificationCodeManager?: EntityManager<VerificationCode,VerificationCodePrimaryKey> | undefined
    ) {
        super(persistenceHandler);
        this.userConverter = userConverter;
        this.orderManager = orderManager;
        this.cartItemManager = cartItemManager;
        this.verificationCodeManager = verificationCodeManager;
    }
    //Private methods:
    private useUserConverter<T>(
        executable: (userConverter: ReversableConverter<UserData, User>) => T
    ): T {
        if(!this.userConverter) {
            throw new Error("persistenHandler field is missing!");
        }

        return executable(this.userConverter);
    }

    private async useOrderManager<T>(
        executable: (userManager: EntityManager<Order,string>) => Promise<T>
    ): Promise<T> {
        if(!this.orderManager){
            throw new Error("orrderManager field is missing!");
        }

        return executable(this.orderManager);
    }

    private async useCartItemManager<T>(
        executable : (cartItemManager: EntityManager<CartItem,CartItemPrimaryKey>) => Promise<T>
    ): Promise<T> {
        if(!this.cartItemManager) {
            throw new Error("cartItemManager field is missing!");
        }

        return executable(this.cartItemManager);
    }
    private async useVerificationCodeManager<T>(
        executable : (verifationCodeManager : EntityManager<VerificationCode,VerificationCodePrimaryKey>) => Promise<T>
    ): Promise<T> {
        if(!this.verificationCodeManager){
            throw new Error("verificationCodeManager field is missing!");
        }

        return executable(this.verificationCodeManager);
    }
    
    private precheckPath(pkey: string, path: any[]) : User | undefined {
        for(const obj of path) {
            if(obj instanceof User) {
                if(obj.Email === pkey) {
                    return obj;
                }
            }
        }
    }

    private async setupDependencies (entity: User, path : any[]) : Promise<void> {
        entity.OrderedOrders = await this.useOrderManager(
            async function (orderManager) {
                return orderManager.getByFilter(
                    {orderedBy : entity.Email as string},
                    path
                );
            }
        )

        entity.CreatedOrders = await this.useOrderManager(
            async function (orderManager) {
                return orderManager.getByFilter(
                    {createdBy : entity.Email as string},
                    path
                );
            }
        )
        
        entity.Cart = await this.useCartItemManager(
            async function (cartItemManager) {
                return cartItemManager.getByFilter(
                    {email : entity.Email as string},
                    path
                )
            }
        )

        entity.VerificationCode = await this.useVerificationCodeManager(
            async function (verificationCodeManager) {
                return verificationCodeManager.getByFilter(
                    {email : entity.Email as string},
                    path
                );
            }
        )
    }

    //Methods: 
    public async get(pkey: string, path: any[]) : Promise<User | undefined> {
        //precheck path
        let entity: User | undefined = this.precheckPath(pkey,path);

        if(entity){
            return entity;
        }

        //Get data
        const data : UserData | undefined = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getUser(pkey);
            }
        )

        //Data not found case
        if(!data) {
            return;
        }

        //Convert data to entity if found
        entity = this.useUserConverter(
            function (userConverter) {
                return userConverter.convert(data);
            }
        )

        //Push entity into path
        path.push(entity);

        //Setup entity's dependencies
        this.setupDependencies(entity,path);

        //return entity
        return entity;
    }

    public async getAll(path : any[]) : Promise<User[]> {
        //Get all user data
        const dataList: UserData[] = await this.usePersistenceHandler(
            function(persistenceHandler) {
                return persistenceHandler.getAllUsers();
            }
        )

        //Result initalization
        const result : User [] = [];

        //Converting data from data list to entities
        for(const data of dataList) {
            //Precheck path
            let entity : User | undefined = this.precheckPath(data.email,path);

            if(entity) {
                result.push(entity);
                continue;
            }

            //Converti data to entity
            entity =  this.useUserConverter(
                function (userConverter) {
                    return userConverter.convert(data);
                }
            )

            //push entity into path
            path.push(entity);

            //Setup entity's dependencies
            this.setupDependencies(entity,path);

            //Push entity to result
            result.push(entity);
        }
        //Return result
        return result;
    }

    public async getByFilter(filter: any, path: any[]) : Promise<User[]> {
        //Get user data
        const dataList : UserData[] = await this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.getUsersByFilter(filter);
            }
        )
        
        //Result initialization
        const result : User[] = [];

        //Converting data into entities
        for(const data of dataList) {
            //Precheck path
            let entity : User | undefined = this.precheckPath(data.email,path);

            if(entity) {
                result.push(entity);
                continue;
            }

            //Convert data into entity
            entity = this.useUserConverter(
                function(userConverter) {
                    return userConverter.convert(data);
                }
            )

            //Push entity into path
            path.push(entity);

            //Setup dependencies for entity
            this.setupDependencies(entity,path);

            //Push entity into result
            result.push(entity);
        }

        //Return result
        return result;
    }

    public async insert(target : User): Promise<void>{
        const self = this;

        this.usePersistenceHandler (
            async function (persistenHandler) {
                persistenHandler.insertUser(

                    self.useUserConverter(
                        function (userConverter) {
                            return userConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async update(target : User) : Promise<void> {
        const self = this;
        
        this.usePersistenceHandler(
            async function (persistenceHandler) {
                persistenceHandler.updateUser(

                    self.useUserConverter (
                        function (userConverter) {
                            return userConverter.reverse(target);
                        }
                    )
                    
                );
            }
        )
    }

    public async remove(target : User) : Promise<void> {
        const self = this;

        this.usePersistenceHandler(
            async function (persistenHandler) {
                persistenHandler.removeUser(

                    self.useUserConverter(
                        function(userConverter) {
                            return userConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async removeByPrimaryKey(pKey: string): Promise<void> {
        this.usePersistenceHandler(
            async function(persistenHandler) {
                persistenHandler.removeUserByPrimaryKey(pKey);
            }
        )
    }

    //Getter / setter
    public get UserConverter(): ReversableConverter<UserData, User> | undefined {
        return this.UserConverter;
    }
    public set UserConverter(from: ReversableConverter<UserData, User> | undefined) {
        this.UserConverter = from;
    }

    public get OrderManager(): EntityManager<Order, string> | undefined {
        return this.orderManager;
    }
    public set OrderManager(value: EntityManager<Order, string> | undefined) {
        this.orderManager = value;
    }

    public get CartItemManager(): EntityManager<CartItem, CartItemPrimaryKey> | undefined {
        return this.cartItemManager;
    }
    public set CartItemManager(value: EntityManager<CartItem, CartItemPrimaryKey> | undefined) {
        this.cartItemManager = value;
    }

    public get VerificationCodeManager(): EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined {
        return this.verificationCodeManager;
    }
    public set VerificationCodeManager(value: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined) {
        this.verificationCodeManager = value;
    }
}