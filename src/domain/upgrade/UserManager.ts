import UserData from "../../persistence/data/UserData";
import PersistenceHandler from "../../persistence/PersistenceHandler";
import CartItemPrimaryKey from "../../persistence/pkeys/CartItemPrimaryKey";
import VerificationCodePrimaryKey from "../../persistence/pkeys/VerificationCodePrimaryKey";
import AsyncReversableConverter from "../../utils/interfaces/AsyncReversableConverter";
import CartItem from "../entities/upgrade/CartItem";
import Order from "../entities/upgrade/Order";
import User from "../entities/upgrade/User";
import VerificationCode from "../entities/VerificationCode";
import EntityManager from "../EntityManager";
import PersistenceHandlerHolder from "../PersistenceHandlerHolder";
import SearchableEntityManager from "../SearchableEntityManager";

export default class UserManager extends PersistenceHandlerHolder implements SearchableEntityManager<User,string> {
    //Fields: 
    private userConverter?: AsyncReversableConverter<UserData, User> | undefined;
    
    private orderManager?: EntityManager<Order, string> | undefined;
    private cartItemManager?: EntityManager<CartItem, CartItemPrimaryKey> | undefined;
    private verificationCodeManager?: EntityManager<VerificationCode, VerificationCodePrimaryKey> | undefined;
    

    //Constructor:
    public constructor(
        persistenceHandler?: PersistenceHandler | undefined,
        userConverter?: AsyncReversableConverter<UserData,User> | undefined,
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
        executable: (userConverter: AsyncReversableConverter<UserData, User>) => Promise<T>
    ): Promise<T> {
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
        // Self definition
        const self = this;

        entity.getOrderedOrdersCallback = async function () {
            return self.useOrderManager(
                async orderManager => orderManager.getByFilter({ orderedBy: entity.Email }, path)
            );
        }

        entity.getCreatedOrdersCallback = async function () {
            return self.useOrderManager(
                async orderManager => orderManager.getByFilter({ createdBy: entity.Email }, path)
            );
        }
        
        entity.getCartCallback = async function () {
            return self.useCartItemManager(
                async cartItemManager => cartItemManager.getByFilter({ email: entity.Email }, path)
            );
        }

        // unused
        // entity.VerificationCode = await this.useVerificationCodeManager(
        //     async function (verificationCodeManager) {
        //         return verificationCodeManager.getByFilter(
        //             {email : entity.Email as string},
        //             path
        //         );
        //     }
        // )
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
        entity = await this.useUserConverter(
            async function (userConverter) {
                return userConverter.convert(data);
            }
        )

        //Push entity into path
        path.push(entity);

        //Setup entity's dependencies
        await this.setupDependencies(entity,path);

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

            //Convert data to entity
            entity =  await this.useUserConverter(
                async function (userConverter) {
                    return userConverter.convert(data);
                }
            )

            //push entity into path
            path.push(entity);

            //Setup entity's dependencies
            await this.setupDependencies(entity,path);

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
            entity = await this.useUserConverter(
                async function(userConverter) {
                    return userConverter.convert(data);
                }
            )

            //Push entity into path
            path.push(entity);

            //Setup dependencies for entity
            await this.setupDependencies(entity,path);

            //Push entity into result
            result.push(entity);
        }

        //Return result
        return result;
    }

    public async insert(target : User): Promise<void>{
        const self = this;

        return this.usePersistenceHandler (
            async function (persistenHandler) {
                return persistenHandler.insertUser(

                    await self.useUserConverter(
                        async function (userConverter) {
                            return userConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async update(target : User) : Promise<void> {
        const self = this;
        
        return this.usePersistenceHandler(
            async function (persistenceHandler) {
                return persistenceHandler.updateUser(

                    await self.useUserConverter (
                        async function (userConverter) {
                            return userConverter.reverse(target);
                        }
                    )
                    
                );
            }
        )
    }

    public async remove(target : User) : Promise<void> {
        const self = this;

        return this.usePersistenceHandler(
            async function (persistenHandler) {
                return persistenHandler.removeUser(

                    await self.useUserConverter(
                        async function(userConverter) {
                            return userConverter.reverse(target);
                        }
                    )

                );
            }
        )
    }

    public async removeByPrimaryKey(pKey: string): Promise<void> {
        return this.usePersistenceHandler(
            async function(persistenHandler) {
                return persistenHandler.removeUserByPrimaryKey(pKey);
            }
        )
    }

    public async getByFilterFunc(filterFunc: (value: User) => boolean | Promise<boolean>): Promise<User[]> {
        const users = await this.getAll([]);
        const result: User[] = [];
        for (const user of users) {
            if (await filterFunc(user)) {
                result.push(user);
            }
        }
        return result;
    }

    public async search(keyword: string): Promise<User[]> {
        return this.getByFilterFunc(
            function (user : User) {
                return (`${user.Email} ${user.FullName} ${user.Gender ? "Nam" : "Nữ"} ${user.Permission} ${user.PhoneNumber}`.toLowerCase().indexOf(keyword) !== -1)
            }
        )
    }

    //Getter / setter
    public get UserConverter(): AsyncReversableConverter<UserData, User> | undefined {
        return this.UserConverter;
    }
    public set UserConverter(from: AsyncReversableConverter<UserData, User> | undefined) {
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