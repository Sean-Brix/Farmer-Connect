
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Commodity
 * 
 */
export type Commodity = $Result.DefaultSelection<Prisma.$CommodityPayload>
/**
 * Model AccountCommodity
 * 
 */
export type AccountCommodity = $Result.DefaultSelection<Prisma.$AccountCommodityPayload>
/**
 * Model InventoryItem
 * 
 */
export type InventoryItem = $Result.DefaultSelection<Prisma.$InventoryItemPayload>
/**
 * Model InventoryCategory
 * 
 */
export type InventoryCategory = $Result.DefaultSelection<Prisma.$InventoryCategoryPayload>
/**
 * Model ItemStack
 * 
 */
export type ItemStack = $Result.DefaultSelection<Prisma.$ItemStackPayload>
/**
 * Model Seminar
 * 
 */
export type Seminar = $Result.DefaultSelection<Prisma.$SeminarPayload>
/**
 * Model SeminarParticipant
 * 
 */
export type SeminarParticipant = $Result.DefaultSelection<Prisma.$SeminarParticipantPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const client_profile: {
  Fishfolk: 'Fishfolk',
  Rural_Based_Org: 'Rural_Based_Org',
  Student: 'Student',
  Agricultural_Fisheries_Technician: 'Agricultural_Fisheries_Technician',
  Youth: 'Youth',
  Women: 'Women',
  Govt_Employee: 'Govt_Employee',
  PWD: 'PWD',
  Indigenous_People: 'Indigenous_People',
  Other: 'Other'
};

export type client_profile = (typeof client_profile)[keyof typeof client_profile]


export const access: {
  Admin: 'Admin',
  User: 'User',
  Super_Admin: 'Super_Admin'
};

export type access = (typeof access)[keyof typeof access]


export const gender: {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other'
};

export type gender = (typeof gender)[keyof typeof gender]


export const item_status: {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Lost: 'Lost',
  Damaged: 'Damaged',
  Reserved: 'Reserved',
  Borrowed: 'Borrowed',
  Distributed: 'Distributed'
};

export type item_status = (typeof item_status)[keyof typeof item_status]


export const seminar_status: {
  Upcoming: 'Upcoming',
  Ongoing: 'Ongoing',
  Completed: 'Completed',
  Cancelled: 'Cancelled'
};

export type seminar_status = (typeof seminar_status)[keyof typeof seminar_status]


export const participant_status: {
  Attended: 'Attended',
  Not_Attended: 'Not_Attended',
  Registered: 'Registered',
  Cancelled: 'Cancelled'
};

export type participant_status = (typeof participant_status)[keyof typeof participant_status]

}

export type client_profile = $Enums.client_profile

export const client_profile: typeof $Enums.client_profile

export type access = $Enums.access

export const access: typeof $Enums.access

export type gender = $Enums.gender

export const gender: typeof $Enums.gender

export type item_status = $Enums.item_status

export const item_status: typeof $Enums.item_status

export type seminar_status = $Enums.seminar_status

export const seminar_status: typeof $Enums.seminar_status

export type participant_status = $Enums.participant_status

export const participant_status: typeof $Enums.participant_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.commodity`: Exposes CRUD operations for the **Commodity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Commodities
    * const commodities = await prisma.commodity.findMany()
    * ```
    */
  get commodity(): Prisma.CommodityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accountCommodity`: Exposes CRUD operations for the **AccountCommodity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccountCommodities
    * const accountCommodities = await prisma.accountCommodity.findMany()
    * ```
    */
  get accountCommodity(): Prisma.AccountCommodityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryItem`: Exposes CRUD operations for the **InventoryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryItems
    * const inventoryItems = await prisma.inventoryItem.findMany()
    * ```
    */
  get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventoryCategory`: Exposes CRUD operations for the **InventoryCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryCategories
    * const inventoryCategories = await prisma.inventoryCategory.findMany()
    * ```
    */
  get inventoryCategory(): Prisma.InventoryCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itemStack`: Exposes CRUD operations for the **ItemStack** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemStacks
    * const itemStacks = await prisma.itemStack.findMany()
    * ```
    */
  get itemStack(): Prisma.ItemStackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seminar`: Exposes CRUD operations for the **Seminar** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Seminars
    * const seminars = await prisma.seminar.findMany()
    * ```
    */
  get seminar(): Prisma.SeminarDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seminarParticipant`: Exposes CRUD operations for the **SeminarParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeminarParticipants
    * const seminarParticipants = await prisma.seminarParticipant.findMany()
    * ```
    */
  get seminarParticipant(): Prisma.SeminarParticipantDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Commodity: 'Commodity',
    AccountCommodity: 'AccountCommodity',
    InventoryItem: 'InventoryItem',
    InventoryCategory: 'InventoryCategory',
    ItemStack: 'ItemStack',
    Seminar: 'Seminar',
    SeminarParticipant: 'SeminarParticipant'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "commodity" | "accountCommodity" | "inventoryItem" | "inventoryCategory" | "itemStack" | "seminar" | "seminarParticipant"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Commodity: {
        payload: Prisma.$CommodityPayload<ExtArgs>
        fields: Prisma.CommodityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommodityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommodityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          findFirst: {
            args: Prisma.CommodityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommodityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          findMany: {
            args: Prisma.CommodityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>[]
          }
          create: {
            args: Prisma.CommodityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          createMany: {
            args: Prisma.CommodityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CommodityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          update: {
            args: Prisma.CommodityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          deleteMany: {
            args: Prisma.CommodityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommodityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommodityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          aggregate: {
            args: Prisma.CommodityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommodity>
          }
          groupBy: {
            args: Prisma.CommodityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommodityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommodityCountArgs<ExtArgs>
            result: $Utils.Optional<CommodityCountAggregateOutputType> | number
          }
        }
      }
      AccountCommodity: {
        payload: Prisma.$AccountCommodityPayload<ExtArgs>
        fields: Prisma.AccountCommodityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountCommodityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountCommodityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          findFirst: {
            args: Prisma.AccountCommodityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountCommodityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          findMany: {
            args: Prisma.AccountCommodityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>[]
          }
          create: {
            args: Prisma.AccountCommodityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          createMany: {
            args: Prisma.AccountCommodityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountCommodityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          update: {
            args: Prisma.AccountCommodityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          deleteMany: {
            args: Prisma.AccountCommodityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountCommodityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountCommodityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountCommodityPayload>
          }
          aggregate: {
            args: Prisma.AccountCommodityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccountCommodity>
          }
          groupBy: {
            args: Prisma.AccountCommodityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountCommodityGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCommodityCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCommodityCountAggregateOutputType> | number
          }
        }
      }
      InventoryItem: {
        payload: Prisma.$InventoryItemPayload<ExtArgs>
        fields: Prisma.InventoryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findFirst: {
            args: Prisma.InventoryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findMany: {
            args: Prisma.InventoryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          create: {
            args: Prisma.InventoryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          createMany: {
            args: Prisma.InventoryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InventoryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          update: {
            args: Prisma.InventoryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          deleteMany: {
            args: Prisma.InventoryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          aggregate: {
            args: Prisma.InventoryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryItem>
          }
          groupBy: {
            args: Prisma.InventoryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryItemCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemCountAggregateOutputType> | number
          }
        }
      }
      InventoryCategory: {
        payload: Prisma.$InventoryCategoryPayload<ExtArgs>
        fields: Prisma.InventoryCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          findMany: {
            args: Prisma.InventoryCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InventoryCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          update: {
            args: Prisma.InventoryCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryCategoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryCategory>
          }
          groupBy: {
            args: Prisma.InventoryCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCategoryCountAggregateOutputType> | number
          }
        }
      }
      ItemStack: {
        payload: Prisma.$ItemStackPayload<ExtArgs>
        fields: Prisma.ItemStackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemStackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemStackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          findFirst: {
            args: Prisma.ItemStackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemStackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          findMany: {
            args: Prisma.ItemStackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>[]
          }
          create: {
            args: Prisma.ItemStackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          createMany: {
            args: Prisma.ItemStackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ItemStackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          update: {
            args: Prisma.ItemStackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          deleteMany: {
            args: Prisma.ItemStackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemStackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemStackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemStackPayload>
          }
          aggregate: {
            args: Prisma.ItemStackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemStack>
          }
          groupBy: {
            args: Prisma.ItemStackGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemStackGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemStackCountArgs<ExtArgs>
            result: $Utils.Optional<ItemStackCountAggregateOutputType> | number
          }
        }
      }
      Seminar: {
        payload: Prisma.$SeminarPayload<ExtArgs>
        fields: Prisma.SeminarFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeminarFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeminarFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          findFirst: {
            args: Prisma.SeminarFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeminarFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          findMany: {
            args: Prisma.SeminarFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>[]
          }
          create: {
            args: Prisma.SeminarCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          createMany: {
            args: Prisma.SeminarCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeminarDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          update: {
            args: Prisma.SeminarUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          deleteMany: {
            args: Prisma.SeminarDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeminarUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeminarUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarPayload>
          }
          aggregate: {
            args: Prisma.SeminarAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeminar>
          }
          groupBy: {
            args: Prisma.SeminarGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeminarGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeminarCountArgs<ExtArgs>
            result: $Utils.Optional<SeminarCountAggregateOutputType> | number
          }
        }
      }
      SeminarParticipant: {
        payload: Prisma.$SeminarParticipantPayload<ExtArgs>
        fields: Prisma.SeminarParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeminarParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeminarParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          findFirst: {
            args: Prisma.SeminarParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeminarParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          findMany: {
            args: Prisma.SeminarParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>[]
          }
          create: {
            args: Prisma.SeminarParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          createMany: {
            args: Prisma.SeminarParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeminarParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          update: {
            args: Prisma.SeminarParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          deleteMany: {
            args: Prisma.SeminarParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeminarParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeminarParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeminarParticipantPayload>
          }
          aggregate: {
            args: Prisma.SeminarParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeminarParticipant>
          }
          groupBy: {
            args: Prisma.SeminarParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeminarParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeminarParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<SeminarParticipantCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    commodity?: CommodityOmit
    accountCommodity?: AccountCommodityOmit
    inventoryItem?: InventoryItemOmit
    inventoryCategory?: InventoryCategoryOmit
    itemStack?: ItemStackOmit
    seminar?: SeminarOmit
    seminarParticipant?: SeminarParticipantOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountCountOutputType
   */

  export type AccountCountOutputType = {
    commodity: number
    seminars: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | AccountCountOutputTypeCountCommodityArgs
    seminars?: boolean | AccountCountOutputTypeCountSeminarsArgs
  }

  // Custom InputTypes
  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountCommodityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountCommodityWhereInput
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountSeminarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeminarParticipantWhereInput
  }


  /**
   * Count Type CommodityCountOutputType
   */

  export type CommodityCountOutputType = {
    accounts: number
  }

  export type CommodityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | CommodityCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommodityCountOutputType
     */
    select?: CommodityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountCommodityWhereInput
  }


  /**
   * Count Type InventoryItemCountOutputType
   */

  export type InventoryItemCountOutputType = {
    item_stacks: number
  }

  export type InventoryItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item_stacks?: boolean | InventoryItemCountOutputTypeCountItem_stacksArgs
  }

  // Custom InputTypes
  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItemCountOutputType
     */
    select?: InventoryItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeCountItem_stacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemStackWhereInput
  }


  /**
   * Count Type InventoryCategoryCountOutputType
   */

  export type InventoryCategoryCountOutputType = {
    items: number
  }

  export type InventoryCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InventoryCategoryCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * InventoryCategoryCountOutputType without action
   */
  export type InventoryCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategoryCountOutputType
     */
    select?: InventoryCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryCategoryCountOutputType without action
   */
  export type InventoryCategoryCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
  }


  /**
   * Count Type SeminarCountOutputType
   */

  export type SeminarCountOutputType = {
    participants: number
  }

  export type SeminarCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | SeminarCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * SeminarCountOutputType without action
   */
  export type SeminarCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarCountOutputType
     */
    select?: SeminarCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SeminarCountOutputType without action
   */
  export type SeminarCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeminarParticipantWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    access: $Enums.access | null
    username: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    middleName: string | null
    gender: $Enums.gender | null
    client_profile: $Enums.client_profile | null
    cellphone_no: string | null
    telephone_no: string | null
    occupation: string | null
    position: string | null
    address: string | null
    picture: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    access: $Enums.access | null
    username: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    middleName: string | null
    gender: $Enums.gender | null
    client_profile: $Enums.client_profile | null
    cellphone_no: string | null
    telephone_no: string | null
    occupation: string | null
    position: string | null
    address: string | null
    picture: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    access: number
    username: number
    email: number
    firstName: number
    lastName: number
    middleName: number
    gender: number
    client_profile: number
    cellphone_no: number
    telephone_no: number
    occupation: number
    position: number
    address: number
    picture: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    access?: true
    username?: true
    email?: true
    firstName?: true
    lastName?: true
    middleName?: true
    gender?: true
    client_profile?: true
    cellphone_no?: true
    telephone_no?: true
    occupation?: true
    position?: true
    address?: true
    picture?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    access?: true
    username?: true
    email?: true
    firstName?: true
    lastName?: true
    middleName?: true
    gender?: true
    client_profile?: true
    cellphone_no?: true
    telephone_no?: true
    occupation?: true
    position?: true
    address?: true
    picture?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    access?: true
    username?: true
    email?: true
    firstName?: true
    lastName?: true
    middleName?: true
    gender?: true
    client_profile?: true
    cellphone_no?: true
    telephone_no?: true
    occupation?: true
    position?: true
    address?: true
    picture?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    access: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName: string | null
    gender: $Enums.gender
    client_profile: $Enums.client_profile
    cellphone_no: string | null
    telephone_no: string | null
    occupation: string | null
    position: string | null
    address: string | null
    picture: string | null
    password: string
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    access?: boolean
    username?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    middleName?: boolean
    gender?: boolean
    client_profile?: boolean
    cellphone_no?: boolean
    telephone_no?: boolean
    occupation?: boolean
    position?: boolean
    address?: boolean
    picture?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commodity?: boolean | Account$commodityArgs<ExtArgs>
    seminars?: boolean | Account$seminarsArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>



  export type AccountSelectScalar = {
    id?: boolean
    access?: boolean
    username?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    middleName?: boolean
    gender?: boolean
    client_profile?: boolean
    cellphone_no?: boolean
    telephone_no?: boolean
    occupation?: boolean
    position?: boolean
    address?: boolean
    picture?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "access" | "username" | "email" | "firstName" | "lastName" | "middleName" | "gender" | "client_profile" | "cellphone_no" | "telephone_no" | "occupation" | "position" | "address" | "picture" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | Account$commodityArgs<ExtArgs>
    seminars?: boolean | Account$seminarsArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      commodity: Prisma.$AccountCommodityPayload<ExtArgs>[]
      seminars: Prisma.$SeminarParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      access: $Enums.access
      username: string
      email: string
      firstName: string
      lastName: string
      middleName: string | null
      gender: $Enums.gender
      client_profile: $Enums.client_profile
      cellphone_no: string | null
      telephone_no: string | null
      occupation: string | null
      position: string | null
      address: string | null
      picture: string | null
      password: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends Account$commodityArgs<ExtArgs> = {}>(args?: Subset<T, Account$commodityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seminars<T extends Account$seminarsArgs<ExtArgs> = {}>(args?: Subset<T, Account$seminarsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly access: FieldRef<"Account", 'access'>
    readonly username: FieldRef<"Account", 'String'>
    readonly email: FieldRef<"Account", 'String'>
    readonly firstName: FieldRef<"Account", 'String'>
    readonly lastName: FieldRef<"Account", 'String'>
    readonly middleName: FieldRef<"Account", 'String'>
    readonly gender: FieldRef<"Account", 'gender'>
    readonly client_profile: FieldRef<"Account", 'client_profile'>
    readonly cellphone_no: FieldRef<"Account", 'String'>
    readonly telephone_no: FieldRef<"Account", 'String'>
    readonly occupation: FieldRef<"Account", 'String'>
    readonly position: FieldRef<"Account", 'String'>
    readonly address: FieldRef<"Account", 'String'>
    readonly picture: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account.commodity
   */
  export type Account$commodityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    where?: AccountCommodityWhereInput
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    cursor?: AccountCommodityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountCommodityScalarFieldEnum | AccountCommodityScalarFieldEnum[]
  }

  /**
   * Account.seminars
   */
  export type Account$seminarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    where?: SeminarParticipantWhereInput
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    cursor?: SeminarParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeminarParticipantScalarFieldEnum | SeminarParticipantScalarFieldEnum[]
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Commodity
   */

  export type AggregateCommodity = {
    _count: CommodityCountAggregateOutputType | null
    _min: CommodityMinAggregateOutputType | null
    _max: CommodityMaxAggregateOutputType | null
  }

  export type CommodityMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommodityMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommodityCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommodityMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommodityMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommodityCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommodityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commodity to aggregate.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Commodities
    **/
    _count?: true | CommodityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommodityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommodityMaxAggregateInputType
  }

  export type GetCommodityAggregateType<T extends CommodityAggregateArgs> = {
        [P in keyof T & keyof AggregateCommodity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommodity[P]>
      : GetScalarType<T[P], AggregateCommodity[P]>
  }




  export type CommodityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommodityWhereInput
    orderBy?: CommodityOrderByWithAggregationInput | CommodityOrderByWithAggregationInput[]
    by: CommodityScalarFieldEnum[] | CommodityScalarFieldEnum
    having?: CommodityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommodityCountAggregateInputType | true
    _min?: CommodityMinAggregateInputType
    _max?: CommodityMaxAggregateInputType
  }

  export type CommodityGroupByOutputType = {
    id: string
    name: string
    icon: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: CommodityCountAggregateOutputType | null
    _min: CommodityMinAggregateOutputType | null
    _max: CommodityMaxAggregateOutputType | null
  }

  type GetCommodityGroupByPayload<T extends CommodityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommodityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommodityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommodityGroupByOutputType[P]>
            : GetScalarType<T[P], CommodityGroupByOutputType[P]>
        }
      >
    >


  export type CommoditySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | Commodity$accountsArgs<ExtArgs>
    _count?: boolean | CommodityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["commodity"]>



  export type CommoditySelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CommodityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["commodity"]>
  export type CommodityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | Commodity$accountsArgs<ExtArgs>
    _count?: boolean | CommodityCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CommodityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Commodity"
    objects: {
      accounts: Prisma.$AccountCommodityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string | null
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["commodity"]>
    composites: {}
  }

  type CommodityGetPayload<S extends boolean | null | undefined | CommodityDefaultArgs> = $Result.GetResult<Prisma.$CommodityPayload, S>

  type CommodityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommodityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommodityCountAggregateInputType | true
    }

  export interface CommodityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Commodity'], meta: { name: 'Commodity' } }
    /**
     * Find zero or one Commodity that matches the filter.
     * @param {CommodityFindUniqueArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommodityFindUniqueArgs>(args: SelectSubset<T, CommodityFindUniqueArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Commodity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommodityFindUniqueOrThrowArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommodityFindUniqueOrThrowArgs>(args: SelectSubset<T, CommodityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commodity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindFirstArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommodityFindFirstArgs>(args?: SelectSubset<T, CommodityFindFirstArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commodity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindFirstOrThrowArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommodityFindFirstOrThrowArgs>(args?: SelectSubset<T, CommodityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Commodities
     * const commodities = await prisma.commodity.findMany()
     * 
     * // Get first 10 Commodities
     * const commodities = await prisma.commodity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commodityWithIdOnly = await prisma.commodity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommodityFindManyArgs>(args?: SelectSubset<T, CommodityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Commodity.
     * @param {CommodityCreateArgs} args - Arguments to create a Commodity.
     * @example
     * // Create one Commodity
     * const Commodity = await prisma.commodity.create({
     *   data: {
     *     // ... data to create a Commodity
     *   }
     * })
     * 
     */
    create<T extends CommodityCreateArgs>(args: SelectSubset<T, CommodityCreateArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Commodities.
     * @param {CommodityCreateManyArgs} args - Arguments to create many Commodities.
     * @example
     * // Create many Commodities
     * const commodity = await prisma.commodity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommodityCreateManyArgs>(args?: SelectSubset<T, CommodityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Commodity.
     * @param {CommodityDeleteArgs} args - Arguments to delete one Commodity.
     * @example
     * // Delete one Commodity
     * const Commodity = await prisma.commodity.delete({
     *   where: {
     *     // ... filter to delete one Commodity
     *   }
     * })
     * 
     */
    delete<T extends CommodityDeleteArgs>(args: SelectSubset<T, CommodityDeleteArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Commodity.
     * @param {CommodityUpdateArgs} args - Arguments to update one Commodity.
     * @example
     * // Update one Commodity
     * const commodity = await prisma.commodity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommodityUpdateArgs>(args: SelectSubset<T, CommodityUpdateArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Commodities.
     * @param {CommodityDeleteManyArgs} args - Arguments to filter Commodities to delete.
     * @example
     * // Delete a few Commodities
     * const { count } = await prisma.commodity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommodityDeleteManyArgs>(args?: SelectSubset<T, CommodityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Commodities
     * const commodity = await prisma.commodity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommodityUpdateManyArgs>(args: SelectSubset<T, CommodityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Commodity.
     * @param {CommodityUpsertArgs} args - Arguments to update or create a Commodity.
     * @example
     * // Update or create a Commodity
     * const commodity = await prisma.commodity.upsert({
     *   create: {
     *     // ... data to create a Commodity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Commodity we want to update
     *   }
     * })
     */
    upsert<T extends CommodityUpsertArgs>(args: SelectSubset<T, CommodityUpsertArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityCountArgs} args - Arguments to filter Commodities to count.
     * @example
     * // Count the number of Commodities
     * const count = await prisma.commodity.count({
     *   where: {
     *     // ... the filter for the Commodities we want to count
     *   }
     * })
    **/
    count<T extends CommodityCountArgs>(
      args?: Subset<T, CommodityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommodityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Commodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommodityAggregateArgs>(args: Subset<T, CommodityAggregateArgs>): Prisma.PrismaPromise<GetCommodityAggregateType<T>>

    /**
     * Group by Commodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommodityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommodityGroupByArgs['orderBy'] }
        : { orderBy?: CommodityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommodityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommodityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Commodity model
   */
  readonly fields: CommodityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Commodity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommodityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends Commodity$accountsArgs<ExtArgs> = {}>(args?: Subset<T, Commodity$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Commodity model
   */
  interface CommodityFieldRefs {
    readonly id: FieldRef<"Commodity", 'String'>
    readonly name: FieldRef<"Commodity", 'String'>
    readonly icon: FieldRef<"Commodity", 'String'>
    readonly description: FieldRef<"Commodity", 'String'>
    readonly createdAt: FieldRef<"Commodity", 'DateTime'>
    readonly updatedAt: FieldRef<"Commodity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Commodity findUnique
   */
  export type CommodityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity findUniqueOrThrow
   */
  export type CommodityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity findFirst
   */
  export type CommodityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commodities.
     */
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity findFirstOrThrow
   */
  export type CommodityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commodities.
     */
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity findMany
   */
  export type CommodityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodities to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity create
   */
  export type CommodityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The data needed to create a Commodity.
     */
    data: XOR<CommodityCreateInput, CommodityUncheckedCreateInput>
  }

  /**
   * Commodity createMany
   */
  export type CommodityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Commodities.
     */
    data: CommodityCreateManyInput | CommodityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commodity update
   */
  export type CommodityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The data needed to update a Commodity.
     */
    data: XOR<CommodityUpdateInput, CommodityUncheckedUpdateInput>
    /**
     * Choose, which Commodity to update.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity updateMany
   */
  export type CommodityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Commodities.
     */
    data: XOR<CommodityUpdateManyMutationInput, CommodityUncheckedUpdateManyInput>
    /**
     * Filter which Commodities to update
     */
    where?: CommodityWhereInput
    /**
     * Limit how many Commodities to update.
     */
    limit?: number
  }

  /**
   * Commodity upsert
   */
  export type CommodityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The filter to search for the Commodity to update in case it exists.
     */
    where: CommodityWhereUniqueInput
    /**
     * In case the Commodity found by the `where` argument doesn't exist, create a new Commodity with this data.
     */
    create: XOR<CommodityCreateInput, CommodityUncheckedCreateInput>
    /**
     * In case the Commodity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommodityUpdateInput, CommodityUncheckedUpdateInput>
  }

  /**
   * Commodity delete
   */
  export type CommodityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter which Commodity to delete.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity deleteMany
   */
  export type CommodityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commodities to delete
     */
    where?: CommodityWhereInput
    /**
     * Limit how many Commodities to delete.
     */
    limit?: number
  }

  /**
   * Commodity.accounts
   */
  export type Commodity$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    where?: AccountCommodityWhereInput
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    cursor?: AccountCommodityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountCommodityScalarFieldEnum | AccountCommodityScalarFieldEnum[]
  }

  /**
   * Commodity without action
   */
  export type CommodityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Commodity
     */
    omit?: CommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
  }


  /**
   * Model AccountCommodity
   */

  export type AggregateAccountCommodity = {
    _count: AccountCommodityCountAggregateOutputType | null
    _min: AccountCommodityMinAggregateOutputType | null
    _max: AccountCommodityMaxAggregateOutputType | null
  }

  export type AccountCommodityMinAggregateOutputType = {
    id: string | null
    account_id: string | null
    commodity_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCommodityMaxAggregateOutputType = {
    id: string | null
    account_id: string | null
    commodity_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCommodityCountAggregateOutputType = {
    id: number
    account_id: number
    commodity_id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountCommodityMinAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCommodityMaxAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCommodityCountAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountCommodityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountCommodity to aggregate.
     */
    where?: AccountCommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountCommodities to fetch.
     */
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountCommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountCommodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountCommodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccountCommodities
    **/
    _count?: true | AccountCommodityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountCommodityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountCommodityMaxAggregateInputType
  }

  export type GetAccountCommodityAggregateType<T extends AccountCommodityAggregateArgs> = {
        [P in keyof T & keyof AggregateAccountCommodity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountCommodity[P]>
      : GetScalarType<T[P], AggregateAccountCommodity[P]>
  }




  export type AccountCommodityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountCommodityWhereInput
    orderBy?: AccountCommodityOrderByWithAggregationInput | AccountCommodityOrderByWithAggregationInput[]
    by: AccountCommodityScalarFieldEnum[] | AccountCommodityScalarFieldEnum
    having?: AccountCommodityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCommodityCountAggregateInputType | true
    _min?: AccountCommodityMinAggregateInputType
    _max?: AccountCommodityMaxAggregateInputType
  }

  export type AccountCommodityGroupByOutputType = {
    id: string
    account_id: string
    commodity_id: string
    createdAt: Date
    updatedAt: Date
    _count: AccountCommodityCountAggregateOutputType | null
    _min: AccountCommodityMinAggregateOutputType | null
    _max: AccountCommodityMaxAggregateOutputType | null
  }

  type GetAccountCommodityGroupByPayload<T extends AccountCommodityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountCommodityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountCommodityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountCommodityGroupByOutputType[P]>
            : GetScalarType<T[P], AccountCommodityGroupByOutputType[P]>
        }
      >
    >


  export type AccountCommoditySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    commodity_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accountCommodity"]>



  export type AccountCommoditySelectScalar = {
    id?: boolean
    account_id?: boolean
    commodity_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountCommodityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_id" | "commodity_id" | "createdAt" | "updatedAt", ExtArgs["result"]["accountCommodity"]>
  export type AccountCommodityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $AccountCommodityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccountCommodity"
    objects: {
      commodity: Prisma.$CommodityPayload<ExtArgs>
      account: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      account_id: string
      commodity_id: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accountCommodity"]>
    composites: {}
  }

  type AccountCommodityGetPayload<S extends boolean | null | undefined | AccountCommodityDefaultArgs> = $Result.GetResult<Prisma.$AccountCommodityPayload, S>

  type AccountCommodityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountCommodityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCommodityCountAggregateInputType | true
    }

  export interface AccountCommodityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountCommodity'], meta: { name: 'AccountCommodity' } }
    /**
     * Find zero or one AccountCommodity that matches the filter.
     * @param {AccountCommodityFindUniqueArgs} args - Arguments to find a AccountCommodity
     * @example
     * // Get one AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountCommodityFindUniqueArgs>(args: SelectSubset<T, AccountCommodityFindUniqueArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccountCommodity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountCommodityFindUniqueOrThrowArgs} args - Arguments to find a AccountCommodity
     * @example
     * // Get one AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountCommodityFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountCommodityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountCommodity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityFindFirstArgs} args - Arguments to find a AccountCommodity
     * @example
     * // Get one AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountCommodityFindFirstArgs>(args?: SelectSubset<T, AccountCommodityFindFirstArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccountCommodity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityFindFirstOrThrowArgs} args - Arguments to find a AccountCommodity
     * @example
     * // Get one AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountCommodityFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountCommodityFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccountCommodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountCommodities
     * const accountCommodities = await prisma.accountCommodity.findMany()
     * 
     * // Get first 10 AccountCommodities
     * const accountCommodities = await prisma.accountCommodity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountCommodityWithIdOnly = await prisma.accountCommodity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountCommodityFindManyArgs>(args?: SelectSubset<T, AccountCommodityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccountCommodity.
     * @param {AccountCommodityCreateArgs} args - Arguments to create a AccountCommodity.
     * @example
     * // Create one AccountCommodity
     * const AccountCommodity = await prisma.accountCommodity.create({
     *   data: {
     *     // ... data to create a AccountCommodity
     *   }
     * })
     * 
     */
    create<T extends AccountCommodityCreateArgs>(args: SelectSubset<T, AccountCommodityCreateArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccountCommodities.
     * @param {AccountCommodityCreateManyArgs} args - Arguments to create many AccountCommodities.
     * @example
     * // Create many AccountCommodities
     * const accountCommodity = await prisma.accountCommodity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCommodityCreateManyArgs>(args?: SelectSubset<T, AccountCommodityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AccountCommodity.
     * @param {AccountCommodityDeleteArgs} args - Arguments to delete one AccountCommodity.
     * @example
     * // Delete one AccountCommodity
     * const AccountCommodity = await prisma.accountCommodity.delete({
     *   where: {
     *     // ... filter to delete one AccountCommodity
     *   }
     * })
     * 
     */
    delete<T extends AccountCommodityDeleteArgs>(args: SelectSubset<T, AccountCommodityDeleteArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccountCommodity.
     * @param {AccountCommodityUpdateArgs} args - Arguments to update one AccountCommodity.
     * @example
     * // Update one AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountCommodityUpdateArgs>(args: SelectSubset<T, AccountCommodityUpdateArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccountCommodities.
     * @param {AccountCommodityDeleteManyArgs} args - Arguments to filter AccountCommodities to delete.
     * @example
     * // Delete a few AccountCommodities
     * const { count } = await prisma.accountCommodity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountCommodityDeleteManyArgs>(args?: SelectSubset<T, AccountCommodityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountCommodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountCommodities
     * const accountCommodity = await prisma.accountCommodity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountCommodityUpdateManyArgs>(args: SelectSubset<T, AccountCommodityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AccountCommodity.
     * @param {AccountCommodityUpsertArgs} args - Arguments to update or create a AccountCommodity.
     * @example
     * // Update or create a AccountCommodity
     * const accountCommodity = await prisma.accountCommodity.upsert({
     *   create: {
     *     // ... data to create a AccountCommodity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountCommodity we want to update
     *   }
     * })
     */
    upsert<T extends AccountCommodityUpsertArgs>(args: SelectSubset<T, AccountCommodityUpsertArgs<ExtArgs>>): Prisma__AccountCommodityClient<$Result.GetResult<Prisma.$AccountCommodityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccountCommodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityCountArgs} args - Arguments to filter AccountCommodities to count.
     * @example
     * // Count the number of AccountCommodities
     * const count = await prisma.accountCommodity.count({
     *   where: {
     *     // ... the filter for the AccountCommodities we want to count
     *   }
     * })
    **/
    count<T extends AccountCommodityCountArgs>(
      args?: Subset<T, AccountCommodityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCommodityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccountCommodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountCommodityAggregateArgs>(args: Subset<T, AccountCommodityAggregateArgs>): Prisma.PrismaPromise<GetAccountCommodityAggregateType<T>>

    /**
     * Group by AccountCommodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCommodityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountCommodityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountCommodityGroupByArgs['orderBy'] }
        : { orderBy?: AccountCommodityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountCommodityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountCommodityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccountCommodity model
   */
  readonly fields: AccountCommodityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountCommodity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountCommodityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends CommodityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommodityDefaultArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccountCommodity model
   */
  interface AccountCommodityFieldRefs {
    readonly id: FieldRef<"AccountCommodity", 'String'>
    readonly account_id: FieldRef<"AccountCommodity", 'String'>
    readonly commodity_id: FieldRef<"AccountCommodity", 'String'>
    readonly createdAt: FieldRef<"AccountCommodity", 'DateTime'>
    readonly updatedAt: FieldRef<"AccountCommodity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccountCommodity findUnique
   */
  export type AccountCommodityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter, which AccountCommodity to fetch.
     */
    where: AccountCommodityWhereUniqueInput
  }

  /**
   * AccountCommodity findUniqueOrThrow
   */
  export type AccountCommodityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter, which AccountCommodity to fetch.
     */
    where: AccountCommodityWhereUniqueInput
  }

  /**
   * AccountCommodity findFirst
   */
  export type AccountCommodityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter, which AccountCommodity to fetch.
     */
    where?: AccountCommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountCommodities to fetch.
     */
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountCommodities.
     */
    cursor?: AccountCommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountCommodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountCommodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountCommodities.
     */
    distinct?: AccountCommodityScalarFieldEnum | AccountCommodityScalarFieldEnum[]
  }

  /**
   * AccountCommodity findFirstOrThrow
   */
  export type AccountCommodityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter, which AccountCommodity to fetch.
     */
    where?: AccountCommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountCommodities to fetch.
     */
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountCommodities.
     */
    cursor?: AccountCommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountCommodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountCommodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountCommodities.
     */
    distinct?: AccountCommodityScalarFieldEnum | AccountCommodityScalarFieldEnum[]
  }

  /**
   * AccountCommodity findMany
   */
  export type AccountCommodityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter, which AccountCommodities to fetch.
     */
    where?: AccountCommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountCommodities to fetch.
     */
    orderBy?: AccountCommodityOrderByWithRelationInput | AccountCommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccountCommodities.
     */
    cursor?: AccountCommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountCommodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountCommodities.
     */
    skip?: number
    distinct?: AccountCommodityScalarFieldEnum | AccountCommodityScalarFieldEnum[]
  }

  /**
   * AccountCommodity create
   */
  export type AccountCommodityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * The data needed to create a AccountCommodity.
     */
    data: XOR<AccountCommodityCreateInput, AccountCommodityUncheckedCreateInput>
  }

  /**
   * AccountCommodity createMany
   */
  export type AccountCommodityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountCommodities.
     */
    data: AccountCommodityCreateManyInput | AccountCommodityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccountCommodity update
   */
  export type AccountCommodityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * The data needed to update a AccountCommodity.
     */
    data: XOR<AccountCommodityUpdateInput, AccountCommodityUncheckedUpdateInput>
    /**
     * Choose, which AccountCommodity to update.
     */
    where: AccountCommodityWhereUniqueInput
  }

  /**
   * AccountCommodity updateMany
   */
  export type AccountCommodityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountCommodities.
     */
    data: XOR<AccountCommodityUpdateManyMutationInput, AccountCommodityUncheckedUpdateManyInput>
    /**
     * Filter which AccountCommodities to update
     */
    where?: AccountCommodityWhereInput
    /**
     * Limit how many AccountCommodities to update.
     */
    limit?: number
  }

  /**
   * AccountCommodity upsert
   */
  export type AccountCommodityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * The filter to search for the AccountCommodity to update in case it exists.
     */
    where: AccountCommodityWhereUniqueInput
    /**
     * In case the AccountCommodity found by the `where` argument doesn't exist, create a new AccountCommodity with this data.
     */
    create: XOR<AccountCommodityCreateInput, AccountCommodityUncheckedCreateInput>
    /**
     * In case the AccountCommodity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountCommodityUpdateInput, AccountCommodityUncheckedUpdateInput>
  }

  /**
   * AccountCommodity delete
   */
  export type AccountCommodityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
    /**
     * Filter which AccountCommodity to delete.
     */
    where: AccountCommodityWhereUniqueInput
  }

  /**
   * AccountCommodity deleteMany
   */
  export type AccountCommodityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountCommodities to delete
     */
    where?: AccountCommodityWhereInput
    /**
     * Limit how many AccountCommodities to delete.
     */
    limit?: number
  }

  /**
   * AccountCommodity without action
   */
  export type AccountCommodityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCommodity
     */
    select?: AccountCommoditySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccountCommodity
     */
    omit?: AccountCommodityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountCommodityInclude<ExtArgs> | null
  }


  /**
   * Model InventoryItem
   */

  export type AggregateInventoryItem = {
    _count: InventoryItemCountAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  export type InventoryItemMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemCountAggregateOutputType = {
    id: number
    name: number
    description: number
    categoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryItemMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItem to aggregate.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryItems
    **/
    _count?: true | InventoryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryItemMaxAggregateInputType
  }

  export type GetInventoryItemAggregateType<T extends InventoryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryItem[P]>
      : GetScalarType<T[P], AggregateInventoryItem[P]>
  }




  export type InventoryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithAggregationInput | InventoryItemOrderByWithAggregationInput[]
    by: InventoryItemScalarFieldEnum[] | InventoryItemScalarFieldEnum
    having?: InventoryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryItemCountAggregateInputType | true
    _min?: InventoryItemMinAggregateInputType
    _max?: InventoryItemMaxAggregateInputType
  }

  export type InventoryItemGroupByOutputType = {
    id: string
    name: string
    description: string | null
    categoryId: string
    createdAt: Date
    updatedAt: Date
    _count: InventoryItemCountAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  type GetInventoryItemGroupByPayload<T extends InventoryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
        }
      >
    >


  export type InventoryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item_stacks?: boolean | InventoryItem$item_stacksArgs<ExtArgs>
    category?: boolean | InventoryCategoryDefaultArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>



  export type InventoryItemSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "categoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["inventoryItem"]>
  export type InventoryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item_stacks?: boolean | InventoryItem$item_stacksArgs<ExtArgs>
    category?: boolean | InventoryCategoryDefaultArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InventoryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryItem"
    objects: {
      item_stacks: Prisma.$ItemStackPayload<ExtArgs>[]
      category: Prisma.$InventoryCategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      categoryId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventoryItem"]>
    composites: {}
  }

  type InventoryItemGetPayload<S extends boolean | null | undefined | InventoryItemDefaultArgs> = $Result.GetResult<Prisma.$InventoryItemPayload, S>

  type InventoryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryItemCountAggregateInputType | true
    }

  export interface InventoryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryItem'], meta: { name: 'InventoryItem' } }
    /**
     * Find zero or one InventoryItem that matches the filter.
     * @param {InventoryItemFindUniqueArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryItemFindUniqueArgs>(args: SelectSubset<T, InventoryItemFindUniqueArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryItemFindUniqueOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryItemFindFirstArgs>(args?: SelectSubset<T, InventoryItemFindFirstArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany()
     * 
     * // Get first 10 InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryItemFindManyArgs>(args?: SelectSubset<T, InventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryItem.
     * @param {InventoryItemCreateArgs} args - Arguments to create a InventoryItem.
     * @example
     * // Create one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.create({
     *   data: {
     *     // ... data to create a InventoryItem
     *   }
     * })
     * 
     */
    create<T extends InventoryItemCreateArgs>(args: SelectSubset<T, InventoryItemCreateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryItems.
     * @param {InventoryItemCreateManyArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryItemCreateManyArgs>(args?: SelectSubset<T, InventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InventoryItem.
     * @param {InventoryItemDeleteArgs} args - Arguments to delete one InventoryItem.
     * @example
     * // Delete one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.delete({
     *   where: {
     *     // ... filter to delete one InventoryItem
     *   }
     * })
     * 
     */
    delete<T extends InventoryItemDeleteArgs>(args: SelectSubset<T, InventoryItemDeleteArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryItem.
     * @param {InventoryItemUpdateArgs} args - Arguments to update one InventoryItem.
     * @example
     * // Update one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryItemUpdateArgs>(args: SelectSubset<T, InventoryItemUpdateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryItems.
     * @param {InventoryItemDeleteManyArgs} args - Arguments to filter InventoryItems to delete.
     * @example
     * // Delete a few InventoryItems
     * const { count } = await prisma.inventoryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryItemDeleteManyArgs>(args?: SelectSubset<T, InventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryItemUpdateManyArgs>(args: SelectSubset<T, InventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryItem.
     * @param {InventoryItemUpsertArgs} args - Arguments to update or create a InventoryItem.
     * @example
     * // Update or create a InventoryItem
     * const inventoryItem = await prisma.inventoryItem.upsert({
     *   create: {
     *     // ... data to create a InventoryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryItem we want to update
     *   }
     * })
     */
    upsert<T extends InventoryItemUpsertArgs>(args: SelectSubset<T, InventoryItemUpsertArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemCountArgs} args - Arguments to filter InventoryItems to count.
     * @example
     * // Count the number of InventoryItems
     * const count = await prisma.inventoryItem.count({
     *   where: {
     *     // ... the filter for the InventoryItems we want to count
     *   }
     * })
    **/
    count<T extends InventoryItemCountArgs>(
      args?: Subset<T, InventoryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryItemAggregateArgs>(args: Subset<T, InventoryItemAggregateArgs>): Prisma.PrismaPromise<GetInventoryItemAggregateType<T>>

    /**
     * Group by InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryItemGroupByArgs['orderBy'] }
        : { orderBy?: InventoryItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryItem model
   */
  readonly fields: InventoryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item_stacks<T extends InventoryItem$item_stacksArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItem$item_stacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    category<T extends InventoryCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryCategoryDefaultArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryItem model
   */
  interface InventoryItemFieldRefs {
    readonly id: FieldRef<"InventoryItem", 'String'>
    readonly name: FieldRef<"InventoryItem", 'String'>
    readonly description: FieldRef<"InventoryItem", 'String'>
    readonly categoryId: FieldRef<"InventoryItem", 'String'>
    readonly createdAt: FieldRef<"InventoryItem", 'DateTime'>
    readonly updatedAt: FieldRef<"InventoryItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryItem findUnique
   */
  export type InventoryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findUniqueOrThrow
   */
  export type InventoryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findFirst
   */
  export type InventoryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findFirstOrThrow
   */
  export type InventoryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findMany
   */
  export type InventoryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItems to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem create
   */
  export type InventoryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryItem.
     */
    data: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
  }

  /**
   * InventoryItem createMany
   */
  export type InventoryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryItems.
     */
    data: InventoryItemCreateManyInput | InventoryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryItem update
   */
  export type InventoryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryItem.
     */
    data: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
    /**
     * Choose, which InventoryItem to update.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem updateMany
   */
  export type InventoryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryItems.
     */
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyInput>
    /**
     * Filter which InventoryItems to update
     */
    where?: InventoryItemWhereInput
    /**
     * Limit how many InventoryItems to update.
     */
    limit?: number
  }

  /**
   * InventoryItem upsert
   */
  export type InventoryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryItem to update in case it exists.
     */
    where: InventoryItemWhereUniqueInput
    /**
     * In case the InventoryItem found by the `where` argument doesn't exist, create a new InventoryItem with this data.
     */
    create: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
    /**
     * In case the InventoryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
  }

  /**
   * InventoryItem delete
   */
  export type InventoryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter which InventoryItem to delete.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem deleteMany
   */
  export type InventoryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItems to delete
     */
    where?: InventoryItemWhereInput
    /**
     * Limit how many InventoryItems to delete.
     */
    limit?: number
  }

  /**
   * InventoryItem.item_stacks
   */
  export type InventoryItem$item_stacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    where?: ItemStackWhereInput
    orderBy?: ItemStackOrderByWithRelationInput | ItemStackOrderByWithRelationInput[]
    cursor?: ItemStackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemStackScalarFieldEnum | ItemStackScalarFieldEnum[]
  }

  /**
   * InventoryItem without action
   */
  export type InventoryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
  }


  /**
   * Model InventoryCategory
   */

  export type AggregateInventoryCategory = {
    _count: InventoryCategoryCountAggregateOutputType | null
    _min: InventoryCategoryMinAggregateOutputType | null
    _max: InventoryCategoryMaxAggregateOutputType | null
  }

  export type InventoryCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryCategoryCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryCategoryMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryCategoryCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryCategory to aggregate.
     */
    where?: InventoryCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryCategories to fetch.
     */
    orderBy?: InventoryCategoryOrderByWithRelationInput | InventoryCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryCategories
    **/
    _count?: true | InventoryCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryCategoryMaxAggregateInputType
  }

  export type GetInventoryCategoryAggregateType<T extends InventoryCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryCategory[P]>
      : GetScalarType<T[P], AggregateInventoryCategory[P]>
  }




  export type InventoryCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryCategoryWhereInput
    orderBy?: InventoryCategoryOrderByWithAggregationInput | InventoryCategoryOrderByWithAggregationInput[]
    by: InventoryCategoryScalarFieldEnum[] | InventoryCategoryScalarFieldEnum
    having?: InventoryCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCategoryCountAggregateInputType | true
    _min?: InventoryCategoryMinAggregateInputType
    _max?: InventoryCategoryMaxAggregateInputType
  }

  export type InventoryCategoryGroupByOutputType = {
    id: string
    name: string
    icon: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: InventoryCategoryCountAggregateOutputType | null
    _min: InventoryCategoryMinAggregateOutputType | null
    _max: InventoryCategoryMaxAggregateOutputType | null
  }

  type GetInventoryCategoryGroupByPayload<T extends InventoryCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryCategoryGroupByOutputType[P]>
        }
      >
    >


  export type InventoryCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | InventoryCategory$itemsArgs<ExtArgs>
    _count?: boolean | InventoryCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryCategory"]>



  export type InventoryCategorySelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["inventoryCategory"]>
  export type InventoryCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InventoryCategory$itemsArgs<ExtArgs>
    _count?: boolean | InventoryCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InventoryCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryCategory"
    objects: {
      items: Prisma.$InventoryItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string | null
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventoryCategory"]>
    composites: {}
  }

  type InventoryCategoryGetPayload<S extends boolean | null | undefined | InventoryCategoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryCategoryPayload, S>

  type InventoryCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryCategoryCountAggregateInputType | true
    }

  export interface InventoryCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryCategory'], meta: { name: 'InventoryCategory' } }
    /**
     * Find zero or one InventoryCategory that matches the filter.
     * @param {InventoryCategoryFindUniqueArgs} args - Arguments to find a InventoryCategory
     * @example
     * // Get one InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryCategoryFindUniqueArgs>(args: SelectSubset<T, InventoryCategoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InventoryCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryCategoryFindUniqueOrThrowArgs} args - Arguments to find a InventoryCategory
     * @example
     * // Get one InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryFindFirstArgs} args - Arguments to find a InventoryCategory
     * @example
     * // Get one InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryCategoryFindFirstArgs>(args?: SelectSubset<T, InventoryCategoryFindFirstArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InventoryCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryFindFirstOrThrowArgs} args - Arguments to find a InventoryCategory
     * @example
     * // Get one InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InventoryCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryCategories
     * const inventoryCategories = await prisma.inventoryCategory.findMany()
     * 
     * // Get first 10 InventoryCategories
     * const inventoryCategories = await prisma.inventoryCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryCategoryWithIdOnly = await prisma.inventoryCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryCategoryFindManyArgs>(args?: SelectSubset<T, InventoryCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InventoryCategory.
     * @param {InventoryCategoryCreateArgs} args - Arguments to create a InventoryCategory.
     * @example
     * // Create one InventoryCategory
     * const InventoryCategory = await prisma.inventoryCategory.create({
     *   data: {
     *     // ... data to create a InventoryCategory
     *   }
     * })
     * 
     */
    create<T extends InventoryCategoryCreateArgs>(args: SelectSubset<T, InventoryCategoryCreateArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InventoryCategories.
     * @param {InventoryCategoryCreateManyArgs} args - Arguments to create many InventoryCategories.
     * @example
     * // Create many InventoryCategories
     * const inventoryCategory = await prisma.inventoryCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCategoryCreateManyArgs>(args?: SelectSubset<T, InventoryCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InventoryCategory.
     * @param {InventoryCategoryDeleteArgs} args - Arguments to delete one InventoryCategory.
     * @example
     * // Delete one InventoryCategory
     * const InventoryCategory = await prisma.inventoryCategory.delete({
     *   where: {
     *     // ... filter to delete one InventoryCategory
     *   }
     * })
     * 
     */
    delete<T extends InventoryCategoryDeleteArgs>(args: SelectSubset<T, InventoryCategoryDeleteArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InventoryCategory.
     * @param {InventoryCategoryUpdateArgs} args - Arguments to update one InventoryCategory.
     * @example
     * // Update one InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryCategoryUpdateArgs>(args: SelectSubset<T, InventoryCategoryUpdateArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InventoryCategories.
     * @param {InventoryCategoryDeleteManyArgs} args - Arguments to filter InventoryCategories to delete.
     * @example
     * // Delete a few InventoryCategories
     * const { count } = await prisma.inventoryCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryCategoryDeleteManyArgs>(args?: SelectSubset<T, InventoryCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryCategories
     * const inventoryCategory = await prisma.inventoryCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryCategoryUpdateManyArgs>(args: SelectSubset<T, InventoryCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryCategory.
     * @param {InventoryCategoryUpsertArgs} args - Arguments to update or create a InventoryCategory.
     * @example
     * // Update or create a InventoryCategory
     * const inventoryCategory = await prisma.inventoryCategory.upsert({
     *   create: {
     *     // ... data to create a InventoryCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryCategory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryCategoryUpsertArgs>(args: SelectSubset<T, InventoryCategoryUpsertArgs<ExtArgs>>): Prisma__InventoryCategoryClient<$Result.GetResult<Prisma.$InventoryCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InventoryCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryCountArgs} args - Arguments to filter InventoryCategories to count.
     * @example
     * // Count the number of InventoryCategories
     * const count = await prisma.inventoryCategory.count({
     *   where: {
     *     // ... the filter for the InventoryCategories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCategoryCountArgs>(
      args?: Subset<T, InventoryCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryCategoryAggregateArgs>(args: Subset<T, InventoryCategoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryCategoryAggregateType<T>>

    /**
     * Group by InventoryCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryCategoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryCategory model
   */
  readonly fields: InventoryCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends InventoryCategory$itemsArgs<ExtArgs> = {}>(args?: Subset<T, InventoryCategory$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryCategory model
   */
  interface InventoryCategoryFieldRefs {
    readonly id: FieldRef<"InventoryCategory", 'String'>
    readonly name: FieldRef<"InventoryCategory", 'String'>
    readonly icon: FieldRef<"InventoryCategory", 'String'>
    readonly description: FieldRef<"InventoryCategory", 'String'>
    readonly createdAt: FieldRef<"InventoryCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"InventoryCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryCategory findUnique
   */
  export type InventoryCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter, which InventoryCategory to fetch.
     */
    where: InventoryCategoryWhereUniqueInput
  }

  /**
   * InventoryCategory findUniqueOrThrow
   */
  export type InventoryCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter, which InventoryCategory to fetch.
     */
    where: InventoryCategoryWhereUniqueInput
  }

  /**
   * InventoryCategory findFirst
   */
  export type InventoryCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter, which InventoryCategory to fetch.
     */
    where?: InventoryCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryCategories to fetch.
     */
    orderBy?: InventoryCategoryOrderByWithRelationInput | InventoryCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryCategories.
     */
    cursor?: InventoryCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryCategories.
     */
    distinct?: InventoryCategoryScalarFieldEnum | InventoryCategoryScalarFieldEnum[]
  }

  /**
   * InventoryCategory findFirstOrThrow
   */
  export type InventoryCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter, which InventoryCategory to fetch.
     */
    where?: InventoryCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryCategories to fetch.
     */
    orderBy?: InventoryCategoryOrderByWithRelationInput | InventoryCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryCategories.
     */
    cursor?: InventoryCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryCategories.
     */
    distinct?: InventoryCategoryScalarFieldEnum | InventoryCategoryScalarFieldEnum[]
  }

  /**
   * InventoryCategory findMany
   */
  export type InventoryCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter, which InventoryCategories to fetch.
     */
    where?: InventoryCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryCategories to fetch.
     */
    orderBy?: InventoryCategoryOrderByWithRelationInput | InventoryCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryCategories.
     */
    cursor?: InventoryCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryCategories.
     */
    skip?: number
    distinct?: InventoryCategoryScalarFieldEnum | InventoryCategoryScalarFieldEnum[]
  }

  /**
   * InventoryCategory create
   */
  export type InventoryCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryCategory.
     */
    data: XOR<InventoryCategoryCreateInput, InventoryCategoryUncheckedCreateInput>
  }

  /**
   * InventoryCategory createMany
   */
  export type InventoryCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryCategories.
     */
    data: InventoryCategoryCreateManyInput | InventoryCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryCategory update
   */
  export type InventoryCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryCategory.
     */
    data: XOR<InventoryCategoryUpdateInput, InventoryCategoryUncheckedUpdateInput>
    /**
     * Choose, which InventoryCategory to update.
     */
    where: InventoryCategoryWhereUniqueInput
  }

  /**
   * InventoryCategory updateMany
   */
  export type InventoryCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryCategories.
     */
    data: XOR<InventoryCategoryUpdateManyMutationInput, InventoryCategoryUncheckedUpdateManyInput>
    /**
     * Filter which InventoryCategories to update
     */
    where?: InventoryCategoryWhereInput
    /**
     * Limit how many InventoryCategories to update.
     */
    limit?: number
  }

  /**
   * InventoryCategory upsert
   */
  export type InventoryCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryCategory to update in case it exists.
     */
    where: InventoryCategoryWhereUniqueInput
    /**
     * In case the InventoryCategory found by the `where` argument doesn't exist, create a new InventoryCategory with this data.
     */
    create: XOR<InventoryCategoryCreateInput, InventoryCategoryUncheckedCreateInput>
    /**
     * In case the InventoryCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryCategoryUpdateInput, InventoryCategoryUncheckedUpdateInput>
  }

  /**
   * InventoryCategory delete
   */
  export type InventoryCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
    /**
     * Filter which InventoryCategory to delete.
     */
    where: InventoryCategoryWhereUniqueInput
  }

  /**
   * InventoryCategory deleteMany
   */
  export type InventoryCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryCategories to delete
     */
    where?: InventoryCategoryWhereInput
    /**
     * Limit how many InventoryCategories to delete.
     */
    limit?: number
  }

  /**
   * InventoryCategory.items
   */
  export type InventoryCategory$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: InventoryItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    cursor?: InventoryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryCategory without action
   */
  export type InventoryCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCategory
     */
    select?: InventoryCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the InventoryCategory
     */
    omit?: InventoryCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryCategoryInclude<ExtArgs> | null
  }


  /**
   * Model ItemStack
   */

  export type AggregateItemStack = {
    _count: ItemStackCountAggregateOutputType | null
    _avg: ItemStackAvgAggregateOutputType | null
    _sum: ItemStackSumAggregateOutputType | null
    _min: ItemStackMinAggregateOutputType | null
    _max: ItemStackMaxAggregateOutputType | null
  }

  export type ItemStackAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ItemStackSumAggregateOutputType = {
    quantity: number | null
  }

  export type ItemStackMinAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemStackMaxAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemStackCountAggregateOutputType = {
    id: number
    itemId: number
    quantity: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemStackAvgAggregateInputType = {
    quantity?: true
  }

  export type ItemStackSumAggregateInputType = {
    quantity?: true
  }

  export type ItemStackMinAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemStackMaxAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemStackCountAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItemStackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemStack to aggregate.
     */
    where?: ItemStackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemStacks to fetch.
     */
    orderBy?: ItemStackOrderByWithRelationInput | ItemStackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemStackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemStacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemStacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemStacks
    **/
    _count?: true | ItemStackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemStackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemStackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemStackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemStackMaxAggregateInputType
  }

  export type GetItemStackAggregateType<T extends ItemStackAggregateArgs> = {
        [P in keyof T & keyof AggregateItemStack]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemStack[P]>
      : GetScalarType<T[P], AggregateItemStack[P]>
  }




  export type ItemStackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemStackWhereInput
    orderBy?: ItemStackOrderByWithAggregationInput | ItemStackOrderByWithAggregationInput[]
    by: ItemStackScalarFieldEnum[] | ItemStackScalarFieldEnum
    having?: ItemStackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemStackCountAggregateInputType | true
    _avg?: ItemStackAvgAggregateInputType
    _sum?: ItemStackSumAggregateInputType
    _min?: ItemStackMinAggregateInputType
    _max?: ItemStackMaxAggregateInputType
  }

  export type ItemStackGroupByOutputType = {
    id: string
    itemId: string
    quantity: number
    status: $Enums.item_status
    createdAt: Date
    updatedAt: Date
    _count: ItemStackCountAggregateOutputType | null
    _avg: ItemStackAvgAggregateOutputType | null
    _sum: ItemStackSumAggregateOutputType | null
    _min: ItemStackMinAggregateOutputType | null
    _max: ItemStackMaxAggregateOutputType | null
  }

  type GetItemStackGroupByPayload<T extends ItemStackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemStackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemStackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemStackGroupByOutputType[P]>
            : GetScalarType<T[P], ItemStackGroupByOutputType[P]>
        }
      >
    >


  export type ItemStackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemStack"]>



  export type ItemStackSelectScalar = {
    id?: boolean
    itemId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemStackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemId" | "quantity" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["itemStack"]>
  export type ItemStackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }

  export type $ItemStackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemStack"
    objects: {
      item: Prisma.$InventoryItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemId: string
      quantity: number
      status: $Enums.item_status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["itemStack"]>
    composites: {}
  }

  type ItemStackGetPayload<S extends boolean | null | undefined | ItemStackDefaultArgs> = $Result.GetResult<Prisma.$ItemStackPayload, S>

  type ItemStackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemStackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemStackCountAggregateInputType | true
    }

  export interface ItemStackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemStack'], meta: { name: 'ItemStack' } }
    /**
     * Find zero or one ItemStack that matches the filter.
     * @param {ItemStackFindUniqueArgs} args - Arguments to find a ItemStack
     * @example
     * // Get one ItemStack
     * const itemStack = await prisma.itemStack.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemStackFindUniqueArgs>(args: SelectSubset<T, ItemStackFindUniqueArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ItemStack that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemStackFindUniqueOrThrowArgs} args - Arguments to find a ItemStack
     * @example
     * // Get one ItemStack
     * const itemStack = await prisma.itemStack.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemStackFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemStackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemStack that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackFindFirstArgs} args - Arguments to find a ItemStack
     * @example
     * // Get one ItemStack
     * const itemStack = await prisma.itemStack.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemStackFindFirstArgs>(args?: SelectSubset<T, ItemStackFindFirstArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemStack that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackFindFirstOrThrowArgs} args - Arguments to find a ItemStack
     * @example
     * // Get one ItemStack
     * const itemStack = await prisma.itemStack.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemStackFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemStackFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ItemStacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemStacks
     * const itemStacks = await prisma.itemStack.findMany()
     * 
     * // Get first 10 ItemStacks
     * const itemStacks = await prisma.itemStack.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemStackWithIdOnly = await prisma.itemStack.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemStackFindManyArgs>(args?: SelectSubset<T, ItemStackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ItemStack.
     * @param {ItemStackCreateArgs} args - Arguments to create a ItemStack.
     * @example
     * // Create one ItemStack
     * const ItemStack = await prisma.itemStack.create({
     *   data: {
     *     // ... data to create a ItemStack
     *   }
     * })
     * 
     */
    create<T extends ItemStackCreateArgs>(args: SelectSubset<T, ItemStackCreateArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ItemStacks.
     * @param {ItemStackCreateManyArgs} args - Arguments to create many ItemStacks.
     * @example
     * // Create many ItemStacks
     * const itemStack = await prisma.itemStack.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemStackCreateManyArgs>(args?: SelectSubset<T, ItemStackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ItemStack.
     * @param {ItemStackDeleteArgs} args - Arguments to delete one ItemStack.
     * @example
     * // Delete one ItemStack
     * const ItemStack = await prisma.itemStack.delete({
     *   where: {
     *     // ... filter to delete one ItemStack
     *   }
     * })
     * 
     */
    delete<T extends ItemStackDeleteArgs>(args: SelectSubset<T, ItemStackDeleteArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ItemStack.
     * @param {ItemStackUpdateArgs} args - Arguments to update one ItemStack.
     * @example
     * // Update one ItemStack
     * const itemStack = await prisma.itemStack.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemStackUpdateArgs>(args: SelectSubset<T, ItemStackUpdateArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ItemStacks.
     * @param {ItemStackDeleteManyArgs} args - Arguments to filter ItemStacks to delete.
     * @example
     * // Delete a few ItemStacks
     * const { count } = await prisma.itemStack.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemStackDeleteManyArgs>(args?: SelectSubset<T, ItemStackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemStacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemStacks
     * const itemStack = await prisma.itemStack.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemStackUpdateManyArgs>(args: SelectSubset<T, ItemStackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemStack.
     * @param {ItemStackUpsertArgs} args - Arguments to update or create a ItemStack.
     * @example
     * // Update or create a ItemStack
     * const itemStack = await prisma.itemStack.upsert({
     *   create: {
     *     // ... data to create a ItemStack
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemStack we want to update
     *   }
     * })
     */
    upsert<T extends ItemStackUpsertArgs>(args: SelectSubset<T, ItemStackUpsertArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ItemStacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackCountArgs} args - Arguments to filter ItemStacks to count.
     * @example
     * // Count the number of ItemStacks
     * const count = await prisma.itemStack.count({
     *   where: {
     *     // ... the filter for the ItemStacks we want to count
     *   }
     * })
    **/
    count<T extends ItemStackCountArgs>(
      args?: Subset<T, ItemStackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemStackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemStack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ItemStackAggregateArgs>(args: Subset<T, ItemStackAggregateArgs>): Prisma.PrismaPromise<GetItemStackAggregateType<T>>

    /**
     * Group by ItemStack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemStackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ItemStackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemStackGroupByArgs['orderBy'] }
        : { orderBy?: ItemStackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ItemStackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemStackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemStack model
   */
  readonly fields: ItemStackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemStack.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemStackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item<T extends InventoryItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItemDefaultArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ItemStack model
   */
  interface ItemStackFieldRefs {
    readonly id: FieldRef<"ItemStack", 'String'>
    readonly itemId: FieldRef<"ItemStack", 'String'>
    readonly quantity: FieldRef<"ItemStack", 'Int'>
    readonly status: FieldRef<"ItemStack", 'item_status'>
    readonly createdAt: FieldRef<"ItemStack", 'DateTime'>
    readonly updatedAt: FieldRef<"ItemStack", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemStack findUnique
   */
  export type ItemStackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter, which ItemStack to fetch.
     */
    where: ItemStackWhereUniqueInput
  }

  /**
   * ItemStack findUniqueOrThrow
   */
  export type ItemStackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter, which ItemStack to fetch.
     */
    where: ItemStackWhereUniqueInput
  }

  /**
   * ItemStack findFirst
   */
  export type ItemStackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter, which ItemStack to fetch.
     */
    where?: ItemStackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemStacks to fetch.
     */
    orderBy?: ItemStackOrderByWithRelationInput | ItemStackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemStacks.
     */
    cursor?: ItemStackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemStacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemStacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemStacks.
     */
    distinct?: ItemStackScalarFieldEnum | ItemStackScalarFieldEnum[]
  }

  /**
   * ItemStack findFirstOrThrow
   */
  export type ItemStackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter, which ItemStack to fetch.
     */
    where?: ItemStackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemStacks to fetch.
     */
    orderBy?: ItemStackOrderByWithRelationInput | ItemStackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemStacks.
     */
    cursor?: ItemStackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemStacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemStacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemStacks.
     */
    distinct?: ItemStackScalarFieldEnum | ItemStackScalarFieldEnum[]
  }

  /**
   * ItemStack findMany
   */
  export type ItemStackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter, which ItemStacks to fetch.
     */
    where?: ItemStackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemStacks to fetch.
     */
    orderBy?: ItemStackOrderByWithRelationInput | ItemStackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemStacks.
     */
    cursor?: ItemStackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemStacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemStacks.
     */
    skip?: number
    distinct?: ItemStackScalarFieldEnum | ItemStackScalarFieldEnum[]
  }

  /**
   * ItemStack create
   */
  export type ItemStackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemStack.
     */
    data: XOR<ItemStackCreateInput, ItemStackUncheckedCreateInput>
  }

  /**
   * ItemStack createMany
   */
  export type ItemStackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemStacks.
     */
    data: ItemStackCreateManyInput | ItemStackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemStack update
   */
  export type ItemStackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemStack.
     */
    data: XOR<ItemStackUpdateInput, ItemStackUncheckedUpdateInput>
    /**
     * Choose, which ItemStack to update.
     */
    where: ItemStackWhereUniqueInput
  }

  /**
   * ItemStack updateMany
   */
  export type ItemStackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemStacks.
     */
    data: XOR<ItemStackUpdateManyMutationInput, ItemStackUncheckedUpdateManyInput>
    /**
     * Filter which ItemStacks to update
     */
    where?: ItemStackWhereInput
    /**
     * Limit how many ItemStacks to update.
     */
    limit?: number
  }

  /**
   * ItemStack upsert
   */
  export type ItemStackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemStack to update in case it exists.
     */
    where: ItemStackWhereUniqueInput
    /**
     * In case the ItemStack found by the `where` argument doesn't exist, create a new ItemStack with this data.
     */
    create: XOR<ItemStackCreateInput, ItemStackUncheckedCreateInput>
    /**
     * In case the ItemStack was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemStackUpdateInput, ItemStackUncheckedUpdateInput>
  }

  /**
   * ItemStack delete
   */
  export type ItemStackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
    /**
     * Filter which ItemStack to delete.
     */
    where: ItemStackWhereUniqueInput
  }

  /**
   * ItemStack deleteMany
   */
  export type ItemStackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemStacks to delete
     */
    where?: ItemStackWhereInput
    /**
     * Limit how many ItemStacks to delete.
     */
    limit?: number
  }

  /**
   * ItemStack without action
   */
  export type ItemStackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStack
     */
    select?: ItemStackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemStack
     */
    omit?: ItemStackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemStackInclude<ExtArgs> | null
  }


  /**
   * Model Seminar
   */

  export type AggregateSeminar = {
    _count: SeminarCountAggregateOutputType | null
    _avg: SeminarAvgAggregateOutputType | null
    _sum: SeminarSumAggregateOutputType | null
    _min: SeminarMinAggregateOutputType | null
    _max: SeminarMaxAggregateOutputType | null
  }

  export type SeminarAvgAggregateOutputType = {
    capacity: number | null
  }

  export type SeminarSumAggregateOutputType = {
    capacity: number | null
  }

  export type SeminarMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    location: string | null
    speaker: string | null
    start_date: Date | null
    end_date: Date | null
    start_time: Date | null
    end_time: Date | null
    capacity: number | null
    registration_deadline: Date | null
    status: $Enums.seminar_status | null
    photo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeminarMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    location: string | null
    speaker: string | null
    start_date: Date | null
    end_date: Date | null
    start_time: Date | null
    end_time: Date | null
    capacity: number | null
    registration_deadline: Date | null
    status: $Enums.seminar_status | null
    photo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeminarCountAggregateOutputType = {
    id: number
    title: number
    description: number
    location: number
    speaker: number
    start_date: number
    end_date: number
    start_time: number
    end_time: number
    capacity: number
    registration_deadline: number
    status: number
    photo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SeminarAvgAggregateInputType = {
    capacity?: true
  }

  export type SeminarSumAggregateInputType = {
    capacity?: true
  }

  export type SeminarMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    location?: true
    speaker?: true
    start_date?: true
    end_date?: true
    start_time?: true
    end_time?: true
    capacity?: true
    registration_deadline?: true
    status?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeminarMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    location?: true
    speaker?: true
    start_date?: true
    end_date?: true
    start_time?: true
    end_time?: true
    capacity?: true
    registration_deadline?: true
    status?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeminarCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    location?: true
    speaker?: true
    start_date?: true
    end_date?: true
    start_time?: true
    end_time?: true
    capacity?: true
    registration_deadline?: true
    status?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SeminarAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Seminar to aggregate.
     */
    where?: SeminarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seminars to fetch.
     */
    orderBy?: SeminarOrderByWithRelationInput | SeminarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeminarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Seminars
    **/
    _count?: true | SeminarCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeminarAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeminarSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeminarMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeminarMaxAggregateInputType
  }

  export type GetSeminarAggregateType<T extends SeminarAggregateArgs> = {
        [P in keyof T & keyof AggregateSeminar]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeminar[P]>
      : GetScalarType<T[P], AggregateSeminar[P]>
  }




  export type SeminarGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeminarWhereInput
    orderBy?: SeminarOrderByWithAggregationInput | SeminarOrderByWithAggregationInput[]
    by: SeminarScalarFieldEnum[] | SeminarScalarFieldEnum
    having?: SeminarScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeminarCountAggregateInputType | true
    _avg?: SeminarAvgAggregateInputType
    _sum?: SeminarSumAggregateInputType
    _min?: SeminarMinAggregateInputType
    _max?: SeminarMaxAggregateInputType
  }

  export type SeminarGroupByOutputType = {
    id: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date
    end_date: Date
    start_time: Date
    end_time: Date
    capacity: number
    registration_deadline: Date
    status: $Enums.seminar_status
    photo: string | null
    createdAt: Date
    updatedAt: Date
    _count: SeminarCountAggregateOutputType | null
    _avg: SeminarAvgAggregateOutputType | null
    _sum: SeminarSumAggregateOutputType | null
    _min: SeminarMinAggregateOutputType | null
    _max: SeminarMaxAggregateOutputType | null
  }

  type GetSeminarGroupByPayload<T extends SeminarGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeminarGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeminarGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeminarGroupByOutputType[P]>
            : GetScalarType<T[P], SeminarGroupByOutputType[P]>
        }
      >
    >


  export type SeminarSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    location?: boolean
    speaker?: boolean
    start_date?: boolean
    end_date?: boolean
    start_time?: boolean
    end_time?: boolean
    capacity?: boolean
    registration_deadline?: boolean
    status?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participants?: boolean | Seminar$participantsArgs<ExtArgs>
    _count?: boolean | SeminarCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seminar"]>



  export type SeminarSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    location?: boolean
    speaker?: boolean
    start_date?: boolean
    end_date?: boolean
    start_time?: boolean
    end_time?: boolean
    capacity?: boolean
    registration_deadline?: boolean
    status?: boolean
    photo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SeminarOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "location" | "speaker" | "start_date" | "end_date" | "start_time" | "end_time" | "capacity" | "registration_deadline" | "status" | "photo" | "createdAt" | "updatedAt", ExtArgs["result"]["seminar"]>
  export type SeminarInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | Seminar$participantsArgs<ExtArgs>
    _count?: boolean | SeminarCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SeminarPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Seminar"
    objects: {
      participants: Prisma.$SeminarParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      location: string
      speaker: string
      start_date: Date
      end_date: Date
      start_time: Date
      end_time: Date
      capacity: number
      registration_deadline: Date
      status: $Enums.seminar_status
      photo: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["seminar"]>
    composites: {}
  }

  type SeminarGetPayload<S extends boolean | null | undefined | SeminarDefaultArgs> = $Result.GetResult<Prisma.$SeminarPayload, S>

  type SeminarCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeminarFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeminarCountAggregateInputType | true
    }

  export interface SeminarDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Seminar'], meta: { name: 'Seminar' } }
    /**
     * Find zero or one Seminar that matches the filter.
     * @param {SeminarFindUniqueArgs} args - Arguments to find a Seminar
     * @example
     * // Get one Seminar
     * const seminar = await prisma.seminar.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeminarFindUniqueArgs>(args: SelectSubset<T, SeminarFindUniqueArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Seminar that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeminarFindUniqueOrThrowArgs} args - Arguments to find a Seminar
     * @example
     * // Get one Seminar
     * const seminar = await prisma.seminar.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeminarFindUniqueOrThrowArgs>(args: SelectSubset<T, SeminarFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminar that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarFindFirstArgs} args - Arguments to find a Seminar
     * @example
     * // Get one Seminar
     * const seminar = await prisma.seminar.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeminarFindFirstArgs>(args?: SelectSubset<T, SeminarFindFirstArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminar that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarFindFirstOrThrowArgs} args - Arguments to find a Seminar
     * @example
     * // Get one Seminar
     * const seminar = await prisma.seminar.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeminarFindFirstOrThrowArgs>(args?: SelectSubset<T, SeminarFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Seminars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Seminars
     * const seminars = await prisma.seminar.findMany()
     * 
     * // Get first 10 Seminars
     * const seminars = await prisma.seminar.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seminarWithIdOnly = await prisma.seminar.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeminarFindManyArgs>(args?: SelectSubset<T, SeminarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Seminar.
     * @param {SeminarCreateArgs} args - Arguments to create a Seminar.
     * @example
     * // Create one Seminar
     * const Seminar = await prisma.seminar.create({
     *   data: {
     *     // ... data to create a Seminar
     *   }
     * })
     * 
     */
    create<T extends SeminarCreateArgs>(args: SelectSubset<T, SeminarCreateArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Seminars.
     * @param {SeminarCreateManyArgs} args - Arguments to create many Seminars.
     * @example
     * // Create many Seminars
     * const seminar = await prisma.seminar.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeminarCreateManyArgs>(args?: SelectSubset<T, SeminarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Seminar.
     * @param {SeminarDeleteArgs} args - Arguments to delete one Seminar.
     * @example
     * // Delete one Seminar
     * const Seminar = await prisma.seminar.delete({
     *   where: {
     *     // ... filter to delete one Seminar
     *   }
     * })
     * 
     */
    delete<T extends SeminarDeleteArgs>(args: SelectSubset<T, SeminarDeleteArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Seminar.
     * @param {SeminarUpdateArgs} args - Arguments to update one Seminar.
     * @example
     * // Update one Seminar
     * const seminar = await prisma.seminar.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeminarUpdateArgs>(args: SelectSubset<T, SeminarUpdateArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Seminars.
     * @param {SeminarDeleteManyArgs} args - Arguments to filter Seminars to delete.
     * @example
     * // Delete a few Seminars
     * const { count } = await prisma.seminar.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeminarDeleteManyArgs>(args?: SelectSubset<T, SeminarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Seminars
     * const seminar = await prisma.seminar.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeminarUpdateManyArgs>(args: SelectSubset<T, SeminarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Seminar.
     * @param {SeminarUpsertArgs} args - Arguments to update or create a Seminar.
     * @example
     * // Update or create a Seminar
     * const seminar = await prisma.seminar.upsert({
     *   create: {
     *     // ... data to create a Seminar
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Seminar we want to update
     *   }
     * })
     */
    upsert<T extends SeminarUpsertArgs>(args: SelectSubset<T, SeminarUpsertArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarCountArgs} args - Arguments to filter Seminars to count.
     * @example
     * // Count the number of Seminars
     * const count = await prisma.seminar.count({
     *   where: {
     *     // ... the filter for the Seminars we want to count
     *   }
     * })
    **/
    count<T extends SeminarCountArgs>(
      args?: Subset<T, SeminarCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeminarCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Seminar.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeminarAggregateArgs>(args: Subset<T, SeminarAggregateArgs>): Prisma.PrismaPromise<GetSeminarAggregateType<T>>

    /**
     * Group by Seminar.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeminarGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeminarGroupByArgs['orderBy'] }
        : { orderBy?: SeminarGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeminarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeminarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Seminar model
   */
  readonly fields: SeminarFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Seminar.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeminarClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends Seminar$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Seminar$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Seminar model
   */
  interface SeminarFieldRefs {
    readonly id: FieldRef<"Seminar", 'String'>
    readonly title: FieldRef<"Seminar", 'String'>
    readonly description: FieldRef<"Seminar", 'String'>
    readonly location: FieldRef<"Seminar", 'String'>
    readonly speaker: FieldRef<"Seminar", 'String'>
    readonly start_date: FieldRef<"Seminar", 'DateTime'>
    readonly end_date: FieldRef<"Seminar", 'DateTime'>
    readonly start_time: FieldRef<"Seminar", 'DateTime'>
    readonly end_time: FieldRef<"Seminar", 'DateTime'>
    readonly capacity: FieldRef<"Seminar", 'Int'>
    readonly registration_deadline: FieldRef<"Seminar", 'DateTime'>
    readonly status: FieldRef<"Seminar", 'seminar_status'>
    readonly photo: FieldRef<"Seminar", 'String'>
    readonly createdAt: FieldRef<"Seminar", 'DateTime'>
    readonly updatedAt: FieldRef<"Seminar", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Seminar findUnique
   */
  export type SeminarFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter, which Seminar to fetch.
     */
    where: SeminarWhereUniqueInput
  }

  /**
   * Seminar findUniqueOrThrow
   */
  export type SeminarFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter, which Seminar to fetch.
     */
    where: SeminarWhereUniqueInput
  }

  /**
   * Seminar findFirst
   */
  export type SeminarFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter, which Seminar to fetch.
     */
    where?: SeminarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seminars to fetch.
     */
    orderBy?: SeminarOrderByWithRelationInput | SeminarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Seminars.
     */
    cursor?: SeminarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Seminars.
     */
    distinct?: SeminarScalarFieldEnum | SeminarScalarFieldEnum[]
  }

  /**
   * Seminar findFirstOrThrow
   */
  export type SeminarFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter, which Seminar to fetch.
     */
    where?: SeminarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seminars to fetch.
     */
    orderBy?: SeminarOrderByWithRelationInput | SeminarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Seminars.
     */
    cursor?: SeminarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Seminars.
     */
    distinct?: SeminarScalarFieldEnum | SeminarScalarFieldEnum[]
  }

  /**
   * Seminar findMany
   */
  export type SeminarFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter, which Seminars to fetch.
     */
    where?: SeminarWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Seminars to fetch.
     */
    orderBy?: SeminarOrderByWithRelationInput | SeminarOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Seminars.
     */
    cursor?: SeminarWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Seminars.
     */
    skip?: number
    distinct?: SeminarScalarFieldEnum | SeminarScalarFieldEnum[]
  }

  /**
   * Seminar create
   */
  export type SeminarCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * The data needed to create a Seminar.
     */
    data: XOR<SeminarCreateInput, SeminarUncheckedCreateInput>
  }

  /**
   * Seminar createMany
   */
  export type SeminarCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Seminars.
     */
    data: SeminarCreateManyInput | SeminarCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Seminar update
   */
  export type SeminarUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * The data needed to update a Seminar.
     */
    data: XOR<SeminarUpdateInput, SeminarUncheckedUpdateInput>
    /**
     * Choose, which Seminar to update.
     */
    where: SeminarWhereUniqueInput
  }

  /**
   * Seminar updateMany
   */
  export type SeminarUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Seminars.
     */
    data: XOR<SeminarUpdateManyMutationInput, SeminarUncheckedUpdateManyInput>
    /**
     * Filter which Seminars to update
     */
    where?: SeminarWhereInput
    /**
     * Limit how many Seminars to update.
     */
    limit?: number
  }

  /**
   * Seminar upsert
   */
  export type SeminarUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * The filter to search for the Seminar to update in case it exists.
     */
    where: SeminarWhereUniqueInput
    /**
     * In case the Seminar found by the `where` argument doesn't exist, create a new Seminar with this data.
     */
    create: XOR<SeminarCreateInput, SeminarUncheckedCreateInput>
    /**
     * In case the Seminar was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeminarUpdateInput, SeminarUncheckedUpdateInput>
  }

  /**
   * Seminar delete
   */
  export type SeminarDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
    /**
     * Filter which Seminar to delete.
     */
    where: SeminarWhereUniqueInput
  }

  /**
   * Seminar deleteMany
   */
  export type SeminarDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Seminars to delete
     */
    where?: SeminarWhereInput
    /**
     * Limit how many Seminars to delete.
     */
    limit?: number
  }

  /**
   * Seminar.participants
   */
  export type Seminar$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    where?: SeminarParticipantWhereInput
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    cursor?: SeminarParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeminarParticipantScalarFieldEnum | SeminarParticipantScalarFieldEnum[]
  }

  /**
   * Seminar without action
   */
  export type SeminarDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Seminar
     */
    select?: SeminarSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Seminar
     */
    omit?: SeminarOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarInclude<ExtArgs> | null
  }


  /**
   * Model SeminarParticipant
   */

  export type AggregateSeminarParticipant = {
    _count: SeminarParticipantCountAggregateOutputType | null
    _min: SeminarParticipantMinAggregateOutputType | null
    _max: SeminarParticipantMaxAggregateOutputType | null
  }

  export type SeminarParticipantMinAggregateOutputType = {
    id: string | null
    seminar_id: string | null
    account_id: string | null
    status: $Enums.participant_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeminarParticipantMaxAggregateOutputType = {
    id: string | null
    seminar_id: string | null
    account_id: string | null
    status: $Enums.participant_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeminarParticipantCountAggregateOutputType = {
    id: number
    seminar_id: number
    account_id: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SeminarParticipantMinAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeminarParticipantMaxAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeminarParticipantCountAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SeminarParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeminarParticipant to aggregate.
     */
    where?: SeminarParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeminarParticipants to fetch.
     */
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeminarParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeminarParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeminarParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeminarParticipants
    **/
    _count?: true | SeminarParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeminarParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeminarParticipantMaxAggregateInputType
  }

  export type GetSeminarParticipantAggregateType<T extends SeminarParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateSeminarParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeminarParticipant[P]>
      : GetScalarType<T[P], AggregateSeminarParticipant[P]>
  }




  export type SeminarParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeminarParticipantWhereInput
    orderBy?: SeminarParticipantOrderByWithAggregationInput | SeminarParticipantOrderByWithAggregationInput[]
    by: SeminarParticipantScalarFieldEnum[] | SeminarParticipantScalarFieldEnum
    having?: SeminarParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeminarParticipantCountAggregateInputType | true
    _min?: SeminarParticipantMinAggregateInputType
    _max?: SeminarParticipantMaxAggregateInputType
  }

  export type SeminarParticipantGroupByOutputType = {
    id: string
    seminar_id: string
    account_id: string
    status: $Enums.participant_status
    createdAt: Date
    updatedAt: Date
    _count: SeminarParticipantCountAggregateOutputType | null
    _min: SeminarParticipantMinAggregateOutputType | null
    _max: SeminarParticipantMaxAggregateOutputType | null
  }

  type GetSeminarParticipantGroupByPayload<T extends SeminarParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeminarParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeminarParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeminarParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], SeminarParticipantGroupByOutputType[P]>
        }
      >
    >


  export type SeminarParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seminar_id?: boolean
    account_id?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seminar?: boolean | SeminarDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seminarParticipant"]>



  export type SeminarParticipantSelectScalar = {
    id?: boolean
    seminar_id?: boolean
    account_id?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SeminarParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "seminar_id" | "account_id" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["seminarParticipant"]>
  export type SeminarParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seminar?: boolean | SeminarDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $SeminarParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeminarParticipant"
    objects: {
      seminar: Prisma.$SeminarPayload<ExtArgs>
      account: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seminar_id: string
      account_id: string
      status: $Enums.participant_status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["seminarParticipant"]>
    composites: {}
  }

  type SeminarParticipantGetPayload<S extends boolean | null | undefined | SeminarParticipantDefaultArgs> = $Result.GetResult<Prisma.$SeminarParticipantPayload, S>

  type SeminarParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeminarParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeminarParticipantCountAggregateInputType | true
    }

  export interface SeminarParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeminarParticipant'], meta: { name: 'SeminarParticipant' } }
    /**
     * Find zero or one SeminarParticipant that matches the filter.
     * @param {SeminarParticipantFindUniqueArgs} args - Arguments to find a SeminarParticipant
     * @example
     * // Get one SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeminarParticipantFindUniqueArgs>(args: SelectSubset<T, SeminarParticipantFindUniqueArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SeminarParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeminarParticipantFindUniqueOrThrowArgs} args - Arguments to find a SeminarParticipant
     * @example
     * // Get one SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeminarParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, SeminarParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeminarParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantFindFirstArgs} args - Arguments to find a SeminarParticipant
     * @example
     * // Get one SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeminarParticipantFindFirstArgs>(args?: SelectSubset<T, SeminarParticipantFindFirstArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeminarParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantFindFirstOrThrowArgs} args - Arguments to find a SeminarParticipant
     * @example
     * // Get one SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeminarParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, SeminarParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeminarParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeminarParticipants
     * const seminarParticipants = await prisma.seminarParticipant.findMany()
     * 
     * // Get first 10 SeminarParticipants
     * const seminarParticipants = await prisma.seminarParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seminarParticipantWithIdOnly = await prisma.seminarParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeminarParticipantFindManyArgs>(args?: SelectSubset<T, SeminarParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SeminarParticipant.
     * @param {SeminarParticipantCreateArgs} args - Arguments to create a SeminarParticipant.
     * @example
     * // Create one SeminarParticipant
     * const SeminarParticipant = await prisma.seminarParticipant.create({
     *   data: {
     *     // ... data to create a SeminarParticipant
     *   }
     * })
     * 
     */
    create<T extends SeminarParticipantCreateArgs>(args: SelectSubset<T, SeminarParticipantCreateArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SeminarParticipants.
     * @param {SeminarParticipantCreateManyArgs} args - Arguments to create many SeminarParticipants.
     * @example
     * // Create many SeminarParticipants
     * const seminarParticipant = await prisma.seminarParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeminarParticipantCreateManyArgs>(args?: SelectSubset<T, SeminarParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SeminarParticipant.
     * @param {SeminarParticipantDeleteArgs} args - Arguments to delete one SeminarParticipant.
     * @example
     * // Delete one SeminarParticipant
     * const SeminarParticipant = await prisma.seminarParticipant.delete({
     *   where: {
     *     // ... filter to delete one SeminarParticipant
     *   }
     * })
     * 
     */
    delete<T extends SeminarParticipantDeleteArgs>(args: SelectSubset<T, SeminarParticipantDeleteArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SeminarParticipant.
     * @param {SeminarParticipantUpdateArgs} args - Arguments to update one SeminarParticipant.
     * @example
     * // Update one SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeminarParticipantUpdateArgs>(args: SelectSubset<T, SeminarParticipantUpdateArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SeminarParticipants.
     * @param {SeminarParticipantDeleteManyArgs} args - Arguments to filter SeminarParticipants to delete.
     * @example
     * // Delete a few SeminarParticipants
     * const { count } = await prisma.seminarParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeminarParticipantDeleteManyArgs>(args?: SelectSubset<T, SeminarParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeminarParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeminarParticipants
     * const seminarParticipant = await prisma.seminarParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeminarParticipantUpdateManyArgs>(args: SelectSubset<T, SeminarParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeminarParticipant.
     * @param {SeminarParticipantUpsertArgs} args - Arguments to update or create a SeminarParticipant.
     * @example
     * // Update or create a SeminarParticipant
     * const seminarParticipant = await prisma.seminarParticipant.upsert({
     *   create: {
     *     // ... data to create a SeminarParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeminarParticipant we want to update
     *   }
     * })
     */
    upsert<T extends SeminarParticipantUpsertArgs>(args: SelectSubset<T, SeminarParticipantUpsertArgs<ExtArgs>>): Prisma__SeminarParticipantClient<$Result.GetResult<Prisma.$SeminarParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SeminarParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantCountArgs} args - Arguments to filter SeminarParticipants to count.
     * @example
     * // Count the number of SeminarParticipants
     * const count = await prisma.seminarParticipant.count({
     *   where: {
     *     // ... the filter for the SeminarParticipants we want to count
     *   }
     * })
    **/
    count<T extends SeminarParticipantCountArgs>(
      args?: Subset<T, SeminarParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeminarParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeminarParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeminarParticipantAggregateArgs>(args: Subset<T, SeminarParticipantAggregateArgs>): Prisma.PrismaPromise<GetSeminarParticipantAggregateType<T>>

    /**
     * Group by SeminarParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeminarParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeminarParticipantGroupByArgs['orderBy'] }
        : { orderBy?: SeminarParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeminarParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeminarParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeminarParticipant model
   */
  readonly fields: SeminarParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeminarParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeminarParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seminar<T extends SeminarDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SeminarDefaultArgs<ExtArgs>>): Prisma__SeminarClient<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeminarParticipant model
   */
  interface SeminarParticipantFieldRefs {
    readonly id: FieldRef<"SeminarParticipant", 'String'>
    readonly seminar_id: FieldRef<"SeminarParticipant", 'String'>
    readonly account_id: FieldRef<"SeminarParticipant", 'String'>
    readonly status: FieldRef<"SeminarParticipant", 'participant_status'>
    readonly createdAt: FieldRef<"SeminarParticipant", 'DateTime'>
    readonly updatedAt: FieldRef<"SeminarParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeminarParticipant findUnique
   */
  export type SeminarParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SeminarParticipant to fetch.
     */
    where: SeminarParticipantWhereUniqueInput
  }

  /**
   * SeminarParticipant findUniqueOrThrow
   */
  export type SeminarParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SeminarParticipant to fetch.
     */
    where: SeminarParticipantWhereUniqueInput
  }

  /**
   * SeminarParticipant findFirst
   */
  export type SeminarParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SeminarParticipant to fetch.
     */
    where?: SeminarParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeminarParticipants to fetch.
     */
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeminarParticipants.
     */
    cursor?: SeminarParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeminarParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeminarParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeminarParticipants.
     */
    distinct?: SeminarParticipantScalarFieldEnum | SeminarParticipantScalarFieldEnum[]
  }

  /**
   * SeminarParticipant findFirstOrThrow
   */
  export type SeminarParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SeminarParticipant to fetch.
     */
    where?: SeminarParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeminarParticipants to fetch.
     */
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeminarParticipants.
     */
    cursor?: SeminarParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeminarParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeminarParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeminarParticipants.
     */
    distinct?: SeminarParticipantScalarFieldEnum | SeminarParticipantScalarFieldEnum[]
  }

  /**
   * SeminarParticipant findMany
   */
  export type SeminarParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SeminarParticipants to fetch.
     */
    where?: SeminarParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeminarParticipants to fetch.
     */
    orderBy?: SeminarParticipantOrderByWithRelationInput | SeminarParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeminarParticipants.
     */
    cursor?: SeminarParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeminarParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeminarParticipants.
     */
    skip?: number
    distinct?: SeminarParticipantScalarFieldEnum | SeminarParticipantScalarFieldEnum[]
  }

  /**
   * SeminarParticipant create
   */
  export type SeminarParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a SeminarParticipant.
     */
    data: XOR<SeminarParticipantCreateInput, SeminarParticipantUncheckedCreateInput>
  }

  /**
   * SeminarParticipant createMany
   */
  export type SeminarParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeminarParticipants.
     */
    data: SeminarParticipantCreateManyInput | SeminarParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeminarParticipant update
   */
  export type SeminarParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a SeminarParticipant.
     */
    data: XOR<SeminarParticipantUpdateInput, SeminarParticipantUncheckedUpdateInput>
    /**
     * Choose, which SeminarParticipant to update.
     */
    where: SeminarParticipantWhereUniqueInput
  }

  /**
   * SeminarParticipant updateMany
   */
  export type SeminarParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeminarParticipants.
     */
    data: XOR<SeminarParticipantUpdateManyMutationInput, SeminarParticipantUncheckedUpdateManyInput>
    /**
     * Filter which SeminarParticipants to update
     */
    where?: SeminarParticipantWhereInput
    /**
     * Limit how many SeminarParticipants to update.
     */
    limit?: number
  }

  /**
   * SeminarParticipant upsert
   */
  export type SeminarParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the SeminarParticipant to update in case it exists.
     */
    where: SeminarParticipantWhereUniqueInput
    /**
     * In case the SeminarParticipant found by the `where` argument doesn't exist, create a new SeminarParticipant with this data.
     */
    create: XOR<SeminarParticipantCreateInput, SeminarParticipantUncheckedCreateInput>
    /**
     * In case the SeminarParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeminarParticipantUpdateInput, SeminarParticipantUncheckedUpdateInput>
  }

  /**
   * SeminarParticipant delete
   */
  export type SeminarParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
    /**
     * Filter which SeminarParticipant to delete.
     */
    where: SeminarParticipantWhereUniqueInput
  }

  /**
   * SeminarParticipant deleteMany
   */
  export type SeminarParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeminarParticipants to delete
     */
    where?: SeminarParticipantWhereInput
    /**
     * Limit how many SeminarParticipants to delete.
     */
    limit?: number
  }

  /**
   * SeminarParticipant without action
   */
  export type SeminarParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarParticipant
     */
    select?: SeminarParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeminarParticipant
     */
    omit?: SeminarParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeminarParticipantInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    access: 'access',
    username: 'username',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',
    gender: 'gender',
    client_profile: 'client_profile',
    cellphone_no: 'cellphone_no',
    telephone_no: 'telephone_no',
    occupation: 'occupation',
    position: 'position',
    address: 'address',
    picture: 'picture',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const CommodityScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommodityScalarFieldEnum = (typeof CommodityScalarFieldEnum)[keyof typeof CommodityScalarFieldEnum]


  export const AccountCommodityScalarFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    commodity_id: 'commodity_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountCommodityScalarFieldEnum = (typeof AccountCommodityScalarFieldEnum)[keyof typeof AccountCommodityScalarFieldEnum]


  export const InventoryItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum]


  export const InventoryCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryCategoryScalarFieldEnum = (typeof InventoryCategoryScalarFieldEnum)[keyof typeof InventoryCategoryScalarFieldEnum]


  export const ItemStackScalarFieldEnum: {
    id: 'id',
    itemId: 'itemId',
    quantity: 'quantity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemStackScalarFieldEnum = (typeof ItemStackScalarFieldEnum)[keyof typeof ItemStackScalarFieldEnum]


  export const SeminarScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    speaker: 'speaker',
    start_date: 'start_date',
    end_date: 'end_date',
    start_time: 'start_time',
    end_time: 'end_time',
    capacity: 'capacity',
    registration_deadline: 'registration_deadline',
    status: 'status',
    photo: 'photo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SeminarScalarFieldEnum = (typeof SeminarScalarFieldEnum)[keyof typeof SeminarScalarFieldEnum]


  export const SeminarParticipantScalarFieldEnum: {
    id: 'id',
    seminar_id: 'seminar_id',
    account_id: 'account_id',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SeminarParticipantScalarFieldEnum = (typeof SeminarParticipantScalarFieldEnum)[keyof typeof SeminarParticipantScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const AccountOrderByRelevanceFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',
    cellphone_no: 'cellphone_no',
    telephone_no: 'telephone_no',
    occupation: 'occupation',
    position: 'position',
    address: 'address',
    picture: 'picture',
    password: 'password'
  };

  export type AccountOrderByRelevanceFieldEnum = (typeof AccountOrderByRelevanceFieldEnum)[keyof typeof AccountOrderByRelevanceFieldEnum]


  export const CommodityOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description'
  };

  export type CommodityOrderByRelevanceFieldEnum = (typeof CommodityOrderByRelevanceFieldEnum)[keyof typeof CommodityOrderByRelevanceFieldEnum]


  export const AccountCommodityOrderByRelevanceFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    commodity_id: 'commodity_id'
  };

  export type AccountCommodityOrderByRelevanceFieldEnum = (typeof AccountCommodityOrderByRelevanceFieldEnum)[keyof typeof AccountCommodityOrderByRelevanceFieldEnum]


  export const InventoryItemOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId'
  };

  export type InventoryItemOrderByRelevanceFieldEnum = (typeof InventoryItemOrderByRelevanceFieldEnum)[keyof typeof InventoryItemOrderByRelevanceFieldEnum]


  export const InventoryCategoryOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description'
  };

  export type InventoryCategoryOrderByRelevanceFieldEnum = (typeof InventoryCategoryOrderByRelevanceFieldEnum)[keyof typeof InventoryCategoryOrderByRelevanceFieldEnum]


  export const ItemStackOrderByRelevanceFieldEnum: {
    id: 'id',
    itemId: 'itemId'
  };

  export type ItemStackOrderByRelevanceFieldEnum = (typeof ItemStackOrderByRelevanceFieldEnum)[keyof typeof ItemStackOrderByRelevanceFieldEnum]


  export const SeminarOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    speaker: 'speaker',
    photo: 'photo'
  };

  export type SeminarOrderByRelevanceFieldEnum = (typeof SeminarOrderByRelevanceFieldEnum)[keyof typeof SeminarOrderByRelevanceFieldEnum]


  export const SeminarParticipantOrderByRelevanceFieldEnum: {
    id: 'id',
    seminar_id: 'seminar_id',
    account_id: 'account_id'
  };

  export type SeminarParticipantOrderByRelevanceFieldEnum = (typeof SeminarParticipantOrderByRelevanceFieldEnum)[keyof typeof SeminarParticipantOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'access'
   */
  export type EnumaccessFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'access'>
    


  /**
   * Reference to a field of type 'gender'
   */
  export type EnumgenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'gender'>
    


  /**
   * Reference to a field of type 'client_profile'
   */
  export type Enumclient_profileFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'client_profile'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'item_status'
   */
  export type Enumitem_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'item_status'>
    


  /**
   * Reference to a field of type 'seminar_status'
   */
  export type Enumseminar_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'seminar_status'>
    


  /**
   * Reference to a field of type 'participant_status'
   */
  export type Enumparticipant_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'participant_status'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    access?: EnumaccessFilter<"Account"> | $Enums.access
    username?: StringFilter<"Account"> | string
    email?: StringFilter<"Account"> | string
    firstName?: StringFilter<"Account"> | string
    lastName?: StringFilter<"Account"> | string
    middleName?: StringNullableFilter<"Account"> | string | null
    gender?: EnumgenderFilter<"Account"> | $Enums.gender
    client_profile?: Enumclient_profileFilter<"Account"> | $Enums.client_profile
    cellphone_no?: StringNullableFilter<"Account"> | string | null
    telephone_no?: StringNullableFilter<"Account"> | string | null
    occupation?: StringNullableFilter<"Account"> | string | null
    position?: StringNullableFilter<"Account"> | string | null
    address?: StringNullableFilter<"Account"> | string | null
    picture?: StringNullableFilter<"Account"> | string | null
    password?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    commodity?: AccountCommodityListRelationFilter
    seminars?: SeminarParticipantListRelationFilter
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    access?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    gender?: SortOrder
    client_profile?: SortOrder
    cellphone_no?: SortOrderInput | SortOrder
    telephone_no?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commodity?: AccountCommodityOrderByRelationAggregateInput
    seminars?: SeminarParticipantOrderByRelationAggregateInput
    _relevance?: AccountOrderByRelevanceInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    access?: EnumaccessFilter<"Account"> | $Enums.access
    firstName?: StringFilter<"Account"> | string
    lastName?: StringFilter<"Account"> | string
    middleName?: StringNullableFilter<"Account"> | string | null
    gender?: EnumgenderFilter<"Account"> | $Enums.gender
    client_profile?: Enumclient_profileFilter<"Account"> | $Enums.client_profile
    cellphone_no?: StringNullableFilter<"Account"> | string | null
    telephone_no?: StringNullableFilter<"Account"> | string | null
    occupation?: StringNullableFilter<"Account"> | string | null
    position?: StringNullableFilter<"Account"> | string | null
    address?: StringNullableFilter<"Account"> | string | null
    picture?: StringNullableFilter<"Account"> | string | null
    password?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    commodity?: AccountCommodityListRelationFilter
    seminars?: SeminarParticipantListRelationFilter
  }, "id" | "username" | "email">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    access?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    gender?: SortOrder
    client_profile?: SortOrder
    cellphone_no?: SortOrderInput | SortOrder
    telephone_no?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    access?: EnumaccessWithAggregatesFilter<"Account"> | $Enums.access
    username?: StringWithAggregatesFilter<"Account"> | string
    email?: StringWithAggregatesFilter<"Account"> | string
    firstName?: StringWithAggregatesFilter<"Account"> | string
    lastName?: StringWithAggregatesFilter<"Account"> | string
    middleName?: StringNullableWithAggregatesFilter<"Account"> | string | null
    gender?: EnumgenderWithAggregatesFilter<"Account"> | $Enums.gender
    client_profile?: Enumclient_profileWithAggregatesFilter<"Account"> | $Enums.client_profile
    cellphone_no?: StringNullableWithAggregatesFilter<"Account"> | string | null
    telephone_no?: StringNullableWithAggregatesFilter<"Account"> | string | null
    occupation?: StringNullableWithAggregatesFilter<"Account"> | string | null
    position?: StringNullableWithAggregatesFilter<"Account"> | string | null
    address?: StringNullableWithAggregatesFilter<"Account"> | string | null
    picture?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringWithAggregatesFilter<"Account"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type CommodityWhereInput = {
    AND?: CommodityWhereInput | CommodityWhereInput[]
    OR?: CommodityWhereInput[]
    NOT?: CommodityWhereInput | CommodityWhereInput[]
    id?: StringFilter<"Commodity"> | string
    name?: StringFilter<"Commodity"> | string
    icon?: StringNullableFilter<"Commodity"> | string | null
    description?: StringNullableFilter<"Commodity"> | string | null
    createdAt?: DateTimeFilter<"Commodity"> | Date | string
    updatedAt?: DateTimeFilter<"Commodity"> | Date | string
    accounts?: AccountCommodityListRelationFilter
  }

  export type CommodityOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountCommodityOrderByRelationAggregateInput
    _relevance?: CommodityOrderByRelevanceInput
  }

  export type CommodityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CommodityWhereInput | CommodityWhereInput[]
    OR?: CommodityWhereInput[]
    NOT?: CommodityWhereInput | CommodityWhereInput[]
    icon?: StringNullableFilter<"Commodity"> | string | null
    description?: StringNullableFilter<"Commodity"> | string | null
    createdAt?: DateTimeFilter<"Commodity"> | Date | string
    updatedAt?: DateTimeFilter<"Commodity"> | Date | string
    accounts?: AccountCommodityListRelationFilter
  }, "id" | "name">

  export type CommodityOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CommodityCountOrderByAggregateInput
    _max?: CommodityMaxOrderByAggregateInput
    _min?: CommodityMinOrderByAggregateInput
  }

  export type CommodityScalarWhereWithAggregatesInput = {
    AND?: CommodityScalarWhereWithAggregatesInput | CommodityScalarWhereWithAggregatesInput[]
    OR?: CommodityScalarWhereWithAggregatesInput[]
    NOT?: CommodityScalarWhereWithAggregatesInput | CommodityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Commodity"> | string
    name?: StringWithAggregatesFilter<"Commodity"> | string
    icon?: StringNullableWithAggregatesFilter<"Commodity"> | string | null
    description?: StringNullableWithAggregatesFilter<"Commodity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Commodity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Commodity"> | Date | string
  }

  export type AccountCommodityWhereInput = {
    AND?: AccountCommodityWhereInput | AccountCommodityWhereInput[]
    OR?: AccountCommodityWhereInput[]
    NOT?: AccountCommodityWhereInput | AccountCommodityWhereInput[]
    id?: StringFilter<"AccountCommodity"> | string
    account_id?: StringFilter<"AccountCommodity"> | string
    commodity_id?: StringFilter<"AccountCommodity"> | string
    createdAt?: DateTimeFilter<"AccountCommodity"> | Date | string
    updatedAt?: DateTimeFilter<"AccountCommodity"> | Date | string
    commodity?: XOR<CommodityScalarRelationFilter, CommodityWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type AccountCommodityOrderByWithRelationInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commodity?: CommodityOrderByWithRelationInput
    account?: AccountOrderByWithRelationInput
    _relevance?: AccountCommodityOrderByRelevanceInput
  }

  export type AccountCommodityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    account_id_commodity_id?: AccountCommodityAccount_idCommodity_idCompoundUniqueInput
    AND?: AccountCommodityWhereInput | AccountCommodityWhereInput[]
    OR?: AccountCommodityWhereInput[]
    NOT?: AccountCommodityWhereInput | AccountCommodityWhereInput[]
    account_id?: StringFilter<"AccountCommodity"> | string
    commodity_id?: StringFilter<"AccountCommodity"> | string
    createdAt?: DateTimeFilter<"AccountCommodity"> | Date | string
    updatedAt?: DateTimeFilter<"AccountCommodity"> | Date | string
    commodity?: XOR<CommodityScalarRelationFilter, CommodityWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id" | "account_id_commodity_id">

  export type AccountCommodityOrderByWithAggregationInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCommodityCountOrderByAggregateInput
    _max?: AccountCommodityMaxOrderByAggregateInput
    _min?: AccountCommodityMinOrderByAggregateInput
  }

  export type AccountCommodityScalarWhereWithAggregatesInput = {
    AND?: AccountCommodityScalarWhereWithAggregatesInput | AccountCommodityScalarWhereWithAggregatesInput[]
    OR?: AccountCommodityScalarWhereWithAggregatesInput[]
    NOT?: AccountCommodityScalarWhereWithAggregatesInput | AccountCommodityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccountCommodity"> | string
    account_id?: StringWithAggregatesFilter<"AccountCommodity"> | string
    commodity_id?: StringWithAggregatesFilter<"AccountCommodity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AccountCommodity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AccountCommodity"> | Date | string
  }

  export type InventoryItemWhereInput = {
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    id?: StringFilter<"InventoryItem"> | string
    name?: StringFilter<"InventoryItem"> | string
    description?: StringNullableFilter<"InventoryItem"> | string | null
    categoryId?: StringFilter<"InventoryItem"> | string
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    item_stacks?: ItemStackListRelationFilter
    category?: XOR<InventoryCategoryScalarRelationFilter, InventoryCategoryWhereInput>
  }

  export type InventoryItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item_stacks?: ItemStackOrderByRelationAggregateInput
    category?: InventoryCategoryOrderByWithRelationInput
    _relevance?: InventoryItemOrderByRelevanceInput
  }

  export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    description?: StringNullableFilter<"InventoryItem"> | string | null
    categoryId?: StringFilter<"InventoryItem"> | string
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    item_stacks?: ItemStackListRelationFilter
    category?: XOR<InventoryCategoryScalarRelationFilter, InventoryCategoryWhereInput>
  }, "id" | "name">

  export type InventoryItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryItemCountOrderByAggregateInput
    _max?: InventoryItemMaxOrderByAggregateInput
    _min?: InventoryItemMinOrderByAggregateInput
  }

  export type InventoryItemScalarWhereWithAggregatesInput = {
    AND?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    OR?: InventoryItemScalarWhereWithAggregatesInput[]
    NOT?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryItem"> | string
    name?: StringWithAggregatesFilter<"InventoryItem"> | string
    description?: StringNullableWithAggregatesFilter<"InventoryItem"> | string | null
    categoryId?: StringWithAggregatesFilter<"InventoryItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
  }

  export type InventoryCategoryWhereInput = {
    AND?: InventoryCategoryWhereInput | InventoryCategoryWhereInput[]
    OR?: InventoryCategoryWhereInput[]
    NOT?: InventoryCategoryWhereInput | InventoryCategoryWhereInput[]
    id?: StringFilter<"InventoryCategory"> | string
    name?: StringFilter<"InventoryCategory"> | string
    icon?: StringNullableFilter<"InventoryCategory"> | string | null
    description?: StringNullableFilter<"InventoryCategory"> | string | null
    createdAt?: DateTimeFilter<"InventoryCategory"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryCategory"> | Date | string
    items?: InventoryItemListRelationFilter
  }

  export type InventoryCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: InventoryItemOrderByRelationAggregateInput
    _relevance?: InventoryCategoryOrderByRelevanceInput
  }

  export type InventoryCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: InventoryCategoryWhereInput | InventoryCategoryWhereInput[]
    OR?: InventoryCategoryWhereInput[]
    NOT?: InventoryCategoryWhereInput | InventoryCategoryWhereInput[]
    icon?: StringNullableFilter<"InventoryCategory"> | string | null
    description?: StringNullableFilter<"InventoryCategory"> | string | null
    createdAt?: DateTimeFilter<"InventoryCategory"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryCategory"> | Date | string
    items?: InventoryItemListRelationFilter
  }, "id" | "name">

  export type InventoryCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryCategoryCountOrderByAggregateInput
    _max?: InventoryCategoryMaxOrderByAggregateInput
    _min?: InventoryCategoryMinOrderByAggregateInput
  }

  export type InventoryCategoryScalarWhereWithAggregatesInput = {
    AND?: InventoryCategoryScalarWhereWithAggregatesInput | InventoryCategoryScalarWhereWithAggregatesInput[]
    OR?: InventoryCategoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryCategoryScalarWhereWithAggregatesInput | InventoryCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryCategory"> | string
    name?: StringWithAggregatesFilter<"InventoryCategory"> | string
    icon?: StringNullableWithAggregatesFilter<"InventoryCategory"> | string | null
    description?: StringNullableWithAggregatesFilter<"InventoryCategory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InventoryCategory"> | Date | string
  }

  export type ItemStackWhereInput = {
    AND?: ItemStackWhereInput | ItemStackWhereInput[]
    OR?: ItemStackWhereInput[]
    NOT?: ItemStackWhereInput | ItemStackWhereInput[]
    id?: StringFilter<"ItemStack"> | string
    itemId?: StringFilter<"ItemStack"> | string
    quantity?: IntFilter<"ItemStack"> | number
    status?: Enumitem_statusFilter<"ItemStack"> | $Enums.item_status
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
    item?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }

  export type ItemStackOrderByWithRelationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item?: InventoryItemOrderByWithRelationInput
    _relevance?: ItemStackOrderByRelevanceInput
  }

  export type ItemStackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ItemStackWhereInput | ItemStackWhereInput[]
    OR?: ItemStackWhereInput[]
    NOT?: ItemStackWhereInput | ItemStackWhereInput[]
    itemId?: StringFilter<"ItemStack"> | string
    quantity?: IntFilter<"ItemStack"> | number
    status?: Enumitem_statusFilter<"ItemStack"> | $Enums.item_status
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
    item?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
  }, "id">

  export type ItemStackOrderByWithAggregationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItemStackCountOrderByAggregateInput
    _avg?: ItemStackAvgOrderByAggregateInput
    _max?: ItemStackMaxOrderByAggregateInput
    _min?: ItemStackMinOrderByAggregateInput
    _sum?: ItemStackSumOrderByAggregateInput
  }

  export type ItemStackScalarWhereWithAggregatesInput = {
    AND?: ItemStackScalarWhereWithAggregatesInput | ItemStackScalarWhereWithAggregatesInput[]
    OR?: ItemStackScalarWhereWithAggregatesInput[]
    NOT?: ItemStackScalarWhereWithAggregatesInput | ItemStackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ItemStack"> | string
    itemId?: StringWithAggregatesFilter<"ItemStack"> | string
    quantity?: IntWithAggregatesFilter<"ItemStack"> | number
    status?: Enumitem_statusWithAggregatesFilter<"ItemStack"> | $Enums.item_status
    createdAt?: DateTimeWithAggregatesFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ItemStack"> | Date | string
  }

  export type SeminarWhereInput = {
    AND?: SeminarWhereInput | SeminarWhereInput[]
    OR?: SeminarWhereInput[]
    NOT?: SeminarWhereInput | SeminarWhereInput[]
    id?: StringFilter<"Seminar"> | string
    title?: StringFilter<"Seminar"> | string
    description?: StringFilter<"Seminar"> | string
    location?: StringFilter<"Seminar"> | string
    speaker?: StringFilter<"Seminar"> | string
    start_date?: DateTimeFilter<"Seminar"> | Date | string
    end_date?: DateTimeFilter<"Seminar"> | Date | string
    start_time?: DateTimeFilter<"Seminar"> | Date | string
    end_time?: DateTimeFilter<"Seminar"> | Date | string
    capacity?: IntFilter<"Seminar"> | number
    registration_deadline?: DateTimeFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusFilter<"Seminar"> | $Enums.seminar_status
    photo?: StringNullableFilter<"Seminar"> | string | null
    createdAt?: DateTimeFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeFilter<"Seminar"> | Date | string
    participants?: SeminarParticipantListRelationFilter
  }

  export type SeminarOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    location?: SortOrder
    speaker?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    capacity?: SortOrder
    registration_deadline?: SortOrder
    status?: SortOrder
    photo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participants?: SeminarParticipantOrderByRelationAggregateInput
    _relevance?: SeminarOrderByRelevanceInput
  }

  export type SeminarWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeminarWhereInput | SeminarWhereInput[]
    OR?: SeminarWhereInput[]
    NOT?: SeminarWhereInput | SeminarWhereInput[]
    title?: StringFilter<"Seminar"> | string
    description?: StringFilter<"Seminar"> | string
    location?: StringFilter<"Seminar"> | string
    speaker?: StringFilter<"Seminar"> | string
    start_date?: DateTimeFilter<"Seminar"> | Date | string
    end_date?: DateTimeFilter<"Seminar"> | Date | string
    start_time?: DateTimeFilter<"Seminar"> | Date | string
    end_time?: DateTimeFilter<"Seminar"> | Date | string
    capacity?: IntFilter<"Seminar"> | number
    registration_deadline?: DateTimeFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusFilter<"Seminar"> | $Enums.seminar_status
    photo?: StringNullableFilter<"Seminar"> | string | null
    createdAt?: DateTimeFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeFilter<"Seminar"> | Date | string
    participants?: SeminarParticipantListRelationFilter
  }, "id">

  export type SeminarOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    location?: SortOrder
    speaker?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    capacity?: SortOrder
    registration_deadline?: SortOrder
    status?: SortOrder
    photo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SeminarCountOrderByAggregateInput
    _avg?: SeminarAvgOrderByAggregateInput
    _max?: SeminarMaxOrderByAggregateInput
    _min?: SeminarMinOrderByAggregateInput
    _sum?: SeminarSumOrderByAggregateInput
  }

  export type SeminarScalarWhereWithAggregatesInput = {
    AND?: SeminarScalarWhereWithAggregatesInput | SeminarScalarWhereWithAggregatesInput[]
    OR?: SeminarScalarWhereWithAggregatesInput[]
    NOT?: SeminarScalarWhereWithAggregatesInput | SeminarScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Seminar"> | string
    title?: StringWithAggregatesFilter<"Seminar"> | string
    description?: StringWithAggregatesFilter<"Seminar"> | string
    location?: StringWithAggregatesFilter<"Seminar"> | string
    speaker?: StringWithAggregatesFilter<"Seminar"> | string
    start_date?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    end_date?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    start_time?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    end_time?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    capacity?: IntWithAggregatesFilter<"Seminar"> | number
    registration_deadline?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusWithAggregatesFilter<"Seminar"> | $Enums.seminar_status
    photo?: StringNullableWithAggregatesFilter<"Seminar"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
  }

  export type SeminarParticipantWhereInput = {
    AND?: SeminarParticipantWhereInput | SeminarParticipantWhereInput[]
    OR?: SeminarParticipantWhereInput[]
    NOT?: SeminarParticipantWhereInput | SeminarParticipantWhereInput[]
    id?: StringFilter<"SeminarParticipant"> | string
    seminar_id?: StringFilter<"SeminarParticipant"> | string
    account_id?: StringFilter<"SeminarParticipant"> | string
    status?: Enumparticipant_statusFilter<"SeminarParticipant"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
    updatedAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
    seminar?: XOR<SeminarScalarRelationFilter, SeminarWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type SeminarParticipantOrderByWithRelationInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    seminar?: SeminarOrderByWithRelationInput
    account?: AccountOrderByWithRelationInput
    _relevance?: SeminarParticipantOrderByRelevanceInput
  }

  export type SeminarParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    seminar_id_account_id?: SeminarParticipantSeminar_idAccount_idCompoundUniqueInput
    AND?: SeminarParticipantWhereInput | SeminarParticipantWhereInput[]
    OR?: SeminarParticipantWhereInput[]
    NOT?: SeminarParticipantWhereInput | SeminarParticipantWhereInput[]
    seminar_id?: StringFilter<"SeminarParticipant"> | string
    account_id?: StringFilter<"SeminarParticipant"> | string
    status?: Enumparticipant_statusFilter<"SeminarParticipant"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
    updatedAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
    seminar?: XOR<SeminarScalarRelationFilter, SeminarWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id" | "seminar_id_account_id">

  export type SeminarParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SeminarParticipantCountOrderByAggregateInput
    _max?: SeminarParticipantMaxOrderByAggregateInput
    _min?: SeminarParticipantMinOrderByAggregateInput
  }

  export type SeminarParticipantScalarWhereWithAggregatesInput = {
    AND?: SeminarParticipantScalarWhereWithAggregatesInput | SeminarParticipantScalarWhereWithAggregatesInput[]
    OR?: SeminarParticipantScalarWhereWithAggregatesInput[]
    NOT?: SeminarParticipantScalarWhereWithAggregatesInput | SeminarParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeminarParticipant"> | string
    seminar_id?: StringWithAggregatesFilter<"SeminarParticipant"> | string
    account_id?: StringWithAggregatesFilter<"SeminarParticipant"> | string
    status?: Enumparticipant_statusWithAggregatesFilter<"SeminarParticipant"> | $Enums.participant_status
    createdAt?: DateTimeWithAggregatesFilter<"SeminarParticipant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SeminarParticipant"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommodityCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCommodityCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCommodityUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountCommodityUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountCommodityUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityCreateManyInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommodityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommodityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutAccountsInput
    account: AccountCreateNestedOneWithoutCommodityInput
  }

  export type AccountCommodityUncheckedCreateInput = {
    id?: string
    account_id: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutAccountsNestedInput
    account?: AccountUpdateOneRequiredWithoutCommodityNestedInput
  }

  export type AccountCommodityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityCreateManyInput = {
    id?: string
    account_id: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackCreateNestedManyWithoutItemInput
    category: InventoryCategoryCreateNestedOneWithoutItemsInput
  }

  export type InventoryItemUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackUncheckedCreateNestedManyWithoutItemInput
  }

  export type InventoryItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUpdateManyWithoutItemNestedInput
    category?: InventoryCategoryUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InventoryItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUncheckedUpdateManyWithoutItemNestedInput
  }

  export type InventoryItemCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCategoryCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InventoryItemCreateNestedManyWithoutCategoryInput
  }

  export type InventoryCategoryUncheckedCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: InventoryItemUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type InventoryCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InventoryItemUpdateManyWithoutCategoryNestedInput
  }

  export type InventoryCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: InventoryItemUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type InventoryCategoryCreateManyInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackCreateInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
    item: InventoryItemCreateNestedOneWithoutItem_stacksInput
  }

  export type ItemStackUncheckedCreateInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: InventoryItemUpdateOneRequiredWithoutItem_stacksNestedInput
  }

  export type ItemStackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackCreateManyInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarCreateInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: Date | string
    end_time: Date | string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SeminarParticipantCreateNestedManyWithoutSeminarInput
  }

  export type SeminarUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: Date | string
    end_time: Date | string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SeminarParticipantUncheckedCreateNestedManyWithoutSeminarInput
  }

  export type SeminarUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SeminarParticipantUpdateManyWithoutSeminarNestedInput
  }

  export type SeminarUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SeminarParticipantUncheckedUpdateManyWithoutSeminarNestedInput
  }

  export type SeminarCreateManyInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: Date | string
    end_time: Date | string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantCreateInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    seminar: SeminarCreateNestedOneWithoutParticipantsInput
    account: AccountCreateNestedOneWithoutSeminarsInput
  }

  export type SeminarParticipantUncheckedCreateInput = {
    id?: string
    seminar_id: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminar?: SeminarUpdateOneRequiredWithoutParticipantsNestedInput
    account?: AccountUpdateOneRequiredWithoutSeminarsNestedInput
  }

  export type SeminarParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantCreateManyInput = {
    id?: string
    seminar_id: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumaccessFilter<$PrismaModel = never> = {
    equals?: $Enums.access | EnumaccessFieldRefInput<$PrismaModel>
    in?: $Enums.access[]
    notIn?: $Enums.access[]
    not?: NestedEnumaccessFilter<$PrismaModel> | $Enums.access
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumgenderFilter<$PrismaModel = never> = {
    equals?: $Enums.gender | EnumgenderFieldRefInput<$PrismaModel>
    in?: $Enums.gender[]
    notIn?: $Enums.gender[]
    not?: NestedEnumgenderFilter<$PrismaModel> | $Enums.gender
  }

  export type Enumclient_profileFilter<$PrismaModel = never> = {
    equals?: $Enums.client_profile | Enumclient_profileFieldRefInput<$PrismaModel>
    in?: $Enums.client_profile[]
    notIn?: $Enums.client_profile[]
    not?: NestedEnumclient_profileFilter<$PrismaModel> | $Enums.client_profile
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountCommodityListRelationFilter = {
    every?: AccountCommodityWhereInput
    some?: AccountCommodityWhereInput
    none?: AccountCommodityWhereInput
  }

  export type SeminarParticipantListRelationFilter = {
    every?: SeminarParticipantWhereInput
    some?: SeminarParticipantWhereInput
    none?: SeminarParticipantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountCommodityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SeminarParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelevanceInput = {
    fields: AccountOrderByRelevanceFieldEnum | AccountOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    access?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    gender?: SortOrder
    client_profile?: SortOrder
    cellphone_no?: SortOrder
    telephone_no?: SortOrder
    occupation?: SortOrder
    position?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    access?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    gender?: SortOrder
    client_profile?: SortOrder
    cellphone_no?: SortOrder
    telephone_no?: SortOrder
    occupation?: SortOrder
    position?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    access?: SortOrder
    username?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    gender?: SortOrder
    client_profile?: SortOrder
    cellphone_no?: SortOrder
    telephone_no?: SortOrder
    occupation?: SortOrder
    position?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumaccessWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.access | EnumaccessFieldRefInput<$PrismaModel>
    in?: $Enums.access[]
    notIn?: $Enums.access[]
    not?: NestedEnumaccessWithAggregatesFilter<$PrismaModel> | $Enums.access
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccessFilter<$PrismaModel>
    _max?: NestedEnumaccessFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumgenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.gender | EnumgenderFieldRefInput<$PrismaModel>
    in?: $Enums.gender[]
    notIn?: $Enums.gender[]
    not?: NestedEnumgenderWithAggregatesFilter<$PrismaModel> | $Enums.gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumgenderFilter<$PrismaModel>
    _max?: NestedEnumgenderFilter<$PrismaModel>
  }

  export type Enumclient_profileWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.client_profile | Enumclient_profileFieldRefInput<$PrismaModel>
    in?: $Enums.client_profile[]
    notIn?: $Enums.client_profile[]
    not?: NestedEnumclient_profileWithAggregatesFilter<$PrismaModel> | $Enums.client_profile
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumclient_profileFilter<$PrismaModel>
    _max?: NestedEnumclient_profileFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CommodityOrderByRelevanceInput = {
    fields: CommodityOrderByRelevanceFieldEnum | CommodityOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CommodityCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommodityMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommodityMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommodityScalarRelationFilter = {
    is?: CommodityWhereInput
    isNot?: CommodityWhereInput
  }

  export type AccountScalarRelationFilter = {
    is?: AccountWhereInput
    isNot?: AccountWhereInput
  }

  export type AccountCommodityOrderByRelevanceInput = {
    fields: AccountCommodityOrderByRelevanceFieldEnum | AccountCommodityOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AccountCommodityAccount_idCommodity_idCompoundUniqueInput = {
    account_id: string
    commodity_id: string
  }

  export type AccountCommodityCountOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountCommodityMaxOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountCommodityMinOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackListRelationFilter = {
    every?: ItemStackWhereInput
    some?: ItemStackWhereInput
    none?: ItemStackWhereInput
  }

  export type InventoryCategoryScalarRelationFilter = {
    is?: InventoryCategoryWhereInput
    isNot?: InventoryCategoryWhereInput
  }

  export type ItemStackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryItemOrderByRelevanceInput = {
    fields: InventoryItemOrderByRelevanceFieldEnum | InventoryItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InventoryItemCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemListRelationFilter = {
    every?: InventoryItemWhereInput
    some?: InventoryItemWhereInput
    none?: InventoryItemWhereInput
  }

  export type InventoryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryCategoryOrderByRelevanceInput = {
    fields: InventoryCategoryOrderByRelevanceFieldEnum | InventoryCategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InventoryCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type Enumitem_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.item_status | Enumitem_statusFieldRefInput<$PrismaModel>
    in?: $Enums.item_status[]
    notIn?: $Enums.item_status[]
    not?: NestedEnumitem_statusFilter<$PrismaModel> | $Enums.item_status
  }

  export type InventoryItemScalarRelationFilter = {
    is?: InventoryItemWhereInput
    isNot?: InventoryItemWhereInput
  }

  export type ItemStackOrderByRelevanceInput = {
    fields: ItemStackOrderByRelevanceFieldEnum | ItemStackOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ItemStackCountOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ItemStackMaxOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackMinOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type Enumitem_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.item_status | Enumitem_statusFieldRefInput<$PrismaModel>
    in?: $Enums.item_status[]
    notIn?: $Enums.item_status[]
    not?: NestedEnumitem_statusWithAggregatesFilter<$PrismaModel> | $Enums.item_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumitem_statusFilter<$PrismaModel>
    _max?: NestedEnumitem_statusFilter<$PrismaModel>
  }

  export type Enumseminar_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.seminar_status | Enumseminar_statusFieldRefInput<$PrismaModel>
    in?: $Enums.seminar_status[]
    notIn?: $Enums.seminar_status[]
    not?: NestedEnumseminar_statusFilter<$PrismaModel> | $Enums.seminar_status
  }

  export type SeminarOrderByRelevanceInput = {
    fields: SeminarOrderByRelevanceFieldEnum | SeminarOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SeminarCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    location?: SortOrder
    speaker?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    capacity?: SortOrder
    registration_deadline?: SortOrder
    status?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeminarAvgOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type SeminarMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    location?: SortOrder
    speaker?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    capacity?: SortOrder
    registration_deadline?: SortOrder
    status?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeminarMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    location?: SortOrder
    speaker?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    capacity?: SortOrder
    registration_deadline?: SortOrder
    status?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeminarSumOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type Enumseminar_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.seminar_status | Enumseminar_statusFieldRefInput<$PrismaModel>
    in?: $Enums.seminar_status[]
    notIn?: $Enums.seminar_status[]
    not?: NestedEnumseminar_statusWithAggregatesFilter<$PrismaModel> | $Enums.seminar_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumseminar_statusFilter<$PrismaModel>
    _max?: NestedEnumseminar_statusFilter<$PrismaModel>
  }

  export type Enumparticipant_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.participant_status | Enumparticipant_statusFieldRefInput<$PrismaModel>
    in?: $Enums.participant_status[]
    notIn?: $Enums.participant_status[]
    not?: NestedEnumparticipant_statusFilter<$PrismaModel> | $Enums.participant_status
  }

  export type SeminarScalarRelationFilter = {
    is?: SeminarWhereInput
    isNot?: SeminarWhereInput
  }

  export type SeminarParticipantOrderByRelevanceInput = {
    fields: SeminarParticipantOrderByRelevanceFieldEnum | SeminarParticipantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SeminarParticipantSeminar_idAccount_idCompoundUniqueInput = {
    seminar_id: string
    account_id: string
  }

  export type SeminarParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeminarParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeminarParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Enumparticipant_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.participant_status | Enumparticipant_statusFieldRefInput<$PrismaModel>
    in?: $Enums.participant_status[]
    notIn?: $Enums.participant_status[]
    not?: NestedEnumparticipant_statusWithAggregatesFilter<$PrismaModel> | $Enums.participant_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumparticipant_statusFilter<$PrismaModel>
    _max?: NestedEnumparticipant_statusFilter<$PrismaModel>
  }

  export type AccountCommodityCreateNestedManyWithoutAccountInput = {
    create?: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput> | AccountCommodityCreateWithoutAccountInput[] | AccountCommodityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutAccountInput | AccountCommodityCreateOrConnectWithoutAccountInput[]
    createMany?: AccountCommodityCreateManyAccountInputEnvelope
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
  }

  export type SeminarParticipantCreateNestedManyWithoutAccountInput = {
    create?: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput> | SeminarParticipantCreateWithoutAccountInput[] | SeminarParticipantUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutAccountInput | SeminarParticipantCreateOrConnectWithoutAccountInput[]
    createMany?: SeminarParticipantCreateManyAccountInputEnvelope
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
  }

  export type AccountCommodityUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput> | AccountCommodityCreateWithoutAccountInput[] | AccountCommodityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutAccountInput | AccountCommodityCreateOrConnectWithoutAccountInput[]
    createMany?: AccountCommodityCreateManyAccountInputEnvelope
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
  }

  export type SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput> | SeminarParticipantCreateWithoutAccountInput[] | SeminarParticipantUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutAccountInput | SeminarParticipantCreateOrConnectWithoutAccountInput[]
    createMany?: SeminarParticipantCreateManyAccountInputEnvelope
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumaccessFieldUpdateOperationsInput = {
    set?: $Enums.access
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumgenderFieldUpdateOperationsInput = {
    set?: $Enums.gender
  }

  export type Enumclient_profileFieldUpdateOperationsInput = {
    set?: $Enums.client_profile
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountCommodityUpdateManyWithoutAccountNestedInput = {
    create?: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput> | AccountCommodityCreateWithoutAccountInput[] | AccountCommodityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutAccountInput | AccountCommodityCreateOrConnectWithoutAccountInput[]
    upsert?: AccountCommodityUpsertWithWhereUniqueWithoutAccountInput | AccountCommodityUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: AccountCommodityCreateManyAccountInputEnvelope
    set?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    disconnect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    delete?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    update?: AccountCommodityUpdateWithWhereUniqueWithoutAccountInput | AccountCommodityUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: AccountCommodityUpdateManyWithWhereWithoutAccountInput | AccountCommodityUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
  }

  export type SeminarParticipantUpdateManyWithoutAccountNestedInput = {
    create?: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput> | SeminarParticipantCreateWithoutAccountInput[] | SeminarParticipantUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutAccountInput | SeminarParticipantCreateOrConnectWithoutAccountInput[]
    upsert?: SeminarParticipantUpsertWithWhereUniqueWithoutAccountInput | SeminarParticipantUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: SeminarParticipantCreateManyAccountInputEnvelope
    set?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    disconnect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    delete?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    update?: SeminarParticipantUpdateWithWhereUniqueWithoutAccountInput | SeminarParticipantUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: SeminarParticipantUpdateManyWithWhereWithoutAccountInput | SeminarParticipantUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
  }

  export type AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput> | AccountCommodityCreateWithoutAccountInput[] | AccountCommodityUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutAccountInput | AccountCommodityCreateOrConnectWithoutAccountInput[]
    upsert?: AccountCommodityUpsertWithWhereUniqueWithoutAccountInput | AccountCommodityUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: AccountCommodityCreateManyAccountInputEnvelope
    set?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    disconnect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    delete?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    update?: AccountCommodityUpdateWithWhereUniqueWithoutAccountInput | AccountCommodityUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: AccountCommodityUpdateManyWithWhereWithoutAccountInput | AccountCommodityUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
  }

  export type SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput> | SeminarParticipantCreateWithoutAccountInput[] | SeminarParticipantUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutAccountInput | SeminarParticipantCreateOrConnectWithoutAccountInput[]
    upsert?: SeminarParticipantUpsertWithWhereUniqueWithoutAccountInput | SeminarParticipantUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: SeminarParticipantCreateManyAccountInputEnvelope
    set?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    disconnect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    delete?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    update?: SeminarParticipantUpdateWithWhereUniqueWithoutAccountInput | SeminarParticipantUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: SeminarParticipantUpdateManyWithWhereWithoutAccountInput | SeminarParticipantUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
  }

  export type AccountCommodityCreateNestedManyWithoutCommodityInput = {
    create?: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput> | AccountCommodityCreateWithoutCommodityInput[] | AccountCommodityUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutCommodityInput | AccountCommodityCreateOrConnectWithoutCommodityInput[]
    createMany?: AccountCommodityCreateManyCommodityInputEnvelope
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
  }

  export type AccountCommodityUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput> | AccountCommodityCreateWithoutCommodityInput[] | AccountCommodityUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutCommodityInput | AccountCommodityCreateOrConnectWithoutCommodityInput[]
    createMany?: AccountCommodityCreateManyCommodityInputEnvelope
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
  }

  export type AccountCommodityUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput> | AccountCommodityCreateWithoutCommodityInput[] | AccountCommodityUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutCommodityInput | AccountCommodityCreateOrConnectWithoutCommodityInput[]
    upsert?: AccountCommodityUpsertWithWhereUniqueWithoutCommodityInput | AccountCommodityUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: AccountCommodityCreateManyCommodityInputEnvelope
    set?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    disconnect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    delete?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    update?: AccountCommodityUpdateWithWhereUniqueWithoutCommodityInput | AccountCommodityUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: AccountCommodityUpdateManyWithWhereWithoutCommodityInput | AccountCommodityUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
  }

  export type AccountCommodityUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput> | AccountCommodityCreateWithoutCommodityInput[] | AccountCommodityUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: AccountCommodityCreateOrConnectWithoutCommodityInput | AccountCommodityCreateOrConnectWithoutCommodityInput[]
    upsert?: AccountCommodityUpsertWithWhereUniqueWithoutCommodityInput | AccountCommodityUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: AccountCommodityCreateManyCommodityInputEnvelope
    set?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    disconnect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    delete?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    connect?: AccountCommodityWhereUniqueInput | AccountCommodityWhereUniqueInput[]
    update?: AccountCommodityUpdateWithWhereUniqueWithoutCommodityInput | AccountCommodityUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: AccountCommodityUpdateManyWithWhereWithoutCommodityInput | AccountCommodityUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
  }

  export type CommodityCreateNestedOneWithoutAccountsInput = {
    create?: XOR<CommodityCreateWithoutAccountsInput, CommodityUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutAccountsInput
    connect?: CommodityWhereUniqueInput
  }

  export type AccountCreateNestedOneWithoutCommodityInput = {
    create?: XOR<AccountCreateWithoutCommodityInput, AccountUncheckedCreateWithoutCommodityInput>
    connectOrCreate?: AccountCreateOrConnectWithoutCommodityInput
    connect?: AccountWhereUniqueInput
  }

  export type CommodityUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<CommodityCreateWithoutAccountsInput, CommodityUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutAccountsInput
    upsert?: CommodityUpsertWithoutAccountsInput
    connect?: CommodityWhereUniqueInput
    update?: XOR<XOR<CommodityUpdateToOneWithWhereWithoutAccountsInput, CommodityUpdateWithoutAccountsInput>, CommodityUncheckedUpdateWithoutAccountsInput>
  }

  export type AccountUpdateOneRequiredWithoutCommodityNestedInput = {
    create?: XOR<AccountCreateWithoutCommodityInput, AccountUncheckedCreateWithoutCommodityInput>
    connectOrCreate?: AccountCreateOrConnectWithoutCommodityInput
    upsert?: AccountUpsertWithoutCommodityInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutCommodityInput, AccountUpdateWithoutCommodityInput>, AccountUncheckedUpdateWithoutCommodityInput>
  }

  export type ItemStackCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
  }

  export type InventoryCategoryCreateNestedOneWithoutItemsInput = {
    create?: XOR<InventoryCategoryCreateWithoutItemsInput, InventoryCategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InventoryCategoryCreateOrConnectWithoutItemsInput
    connect?: InventoryCategoryWhereUniqueInput
  }

  export type ItemStackUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
  }

  export type ItemStackUpdateManyWithoutItemNestedInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    upsert?: ItemStackUpsertWithWhereUniqueWithoutItemInput | ItemStackUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    set?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    disconnect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    delete?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    update?: ItemStackUpdateWithWhereUniqueWithoutItemInput | ItemStackUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ItemStackUpdateManyWithWhereWithoutItemInput | ItemStackUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ItemStackScalarWhereInput | ItemStackScalarWhereInput[]
  }

  export type InventoryCategoryUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<InventoryCategoryCreateWithoutItemsInput, InventoryCategoryUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InventoryCategoryCreateOrConnectWithoutItemsInput
    upsert?: InventoryCategoryUpsertWithoutItemsInput
    connect?: InventoryCategoryWhereUniqueInput
    update?: XOR<XOR<InventoryCategoryUpdateToOneWithWhereWithoutItemsInput, InventoryCategoryUpdateWithoutItemsInput>, InventoryCategoryUncheckedUpdateWithoutItemsInput>
  }

  export type ItemStackUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    upsert?: ItemStackUpsertWithWhereUniqueWithoutItemInput | ItemStackUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    set?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    disconnect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    delete?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
    update?: ItemStackUpdateWithWhereUniqueWithoutItemInput | ItemStackUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ItemStackUpdateManyWithWhereWithoutItemInput | ItemStackUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ItemStackScalarWhereInput | ItemStackScalarWhereInput[]
  }

  export type InventoryItemCreateNestedManyWithoutCategoryInput = {
    create?: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput> | InventoryItemCreateWithoutCategoryInput[] | InventoryItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutCategoryInput | InventoryItemCreateOrConnectWithoutCategoryInput[]
    createMany?: InventoryItemCreateManyCategoryInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type InventoryItemUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput> | InventoryItemCreateWithoutCategoryInput[] | InventoryItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutCategoryInput | InventoryItemCreateOrConnectWithoutCategoryInput[]
    createMany?: InventoryItemCreateManyCategoryInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type InventoryItemUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput> | InventoryItemCreateWithoutCategoryInput[] | InventoryItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutCategoryInput | InventoryItemCreateOrConnectWithoutCategoryInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutCategoryInput | InventoryItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: InventoryItemCreateManyCategoryInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutCategoryInput | InventoryItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutCategoryInput | InventoryItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type InventoryItemUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput> | InventoryItemCreateWithoutCategoryInput[] | InventoryItemUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutCategoryInput | InventoryItemCreateOrConnectWithoutCategoryInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutCategoryInput | InventoryItemUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: InventoryItemCreateManyCategoryInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutCategoryInput | InventoryItemUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutCategoryInput | InventoryItemUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type InventoryItemCreateNestedOneWithoutItem_stacksInput = {
    create?: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutItem_stacksInput
    connect?: InventoryItemWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type Enumitem_statusFieldUpdateOperationsInput = {
    set?: $Enums.item_status
  }

  export type InventoryItemUpdateOneRequiredWithoutItem_stacksNestedInput = {
    create?: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutItem_stacksInput
    upsert?: InventoryItemUpsertWithoutItem_stacksInput
    connect?: InventoryItemWhereUniqueInput
    update?: XOR<XOR<InventoryItemUpdateToOneWithWhereWithoutItem_stacksInput, InventoryItemUpdateWithoutItem_stacksInput>, InventoryItemUncheckedUpdateWithoutItem_stacksInput>
  }

  export type SeminarParticipantCreateNestedManyWithoutSeminarInput = {
    create?: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput> | SeminarParticipantCreateWithoutSeminarInput[] | SeminarParticipantUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutSeminarInput | SeminarParticipantCreateOrConnectWithoutSeminarInput[]
    createMany?: SeminarParticipantCreateManySeminarInputEnvelope
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
  }

  export type SeminarParticipantUncheckedCreateNestedManyWithoutSeminarInput = {
    create?: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput> | SeminarParticipantCreateWithoutSeminarInput[] | SeminarParticipantUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutSeminarInput | SeminarParticipantCreateOrConnectWithoutSeminarInput[]
    createMany?: SeminarParticipantCreateManySeminarInputEnvelope
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
  }

  export type Enumseminar_statusFieldUpdateOperationsInput = {
    set?: $Enums.seminar_status
  }

  export type SeminarParticipantUpdateManyWithoutSeminarNestedInput = {
    create?: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput> | SeminarParticipantCreateWithoutSeminarInput[] | SeminarParticipantUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutSeminarInput | SeminarParticipantCreateOrConnectWithoutSeminarInput[]
    upsert?: SeminarParticipantUpsertWithWhereUniqueWithoutSeminarInput | SeminarParticipantUpsertWithWhereUniqueWithoutSeminarInput[]
    createMany?: SeminarParticipantCreateManySeminarInputEnvelope
    set?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    disconnect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    delete?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    update?: SeminarParticipantUpdateWithWhereUniqueWithoutSeminarInput | SeminarParticipantUpdateWithWhereUniqueWithoutSeminarInput[]
    updateMany?: SeminarParticipantUpdateManyWithWhereWithoutSeminarInput | SeminarParticipantUpdateManyWithWhereWithoutSeminarInput[]
    deleteMany?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
  }

  export type SeminarParticipantUncheckedUpdateManyWithoutSeminarNestedInput = {
    create?: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput> | SeminarParticipantCreateWithoutSeminarInput[] | SeminarParticipantUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutSeminarInput | SeminarParticipantCreateOrConnectWithoutSeminarInput[]
    upsert?: SeminarParticipantUpsertWithWhereUniqueWithoutSeminarInput | SeminarParticipantUpsertWithWhereUniqueWithoutSeminarInput[]
    createMany?: SeminarParticipantCreateManySeminarInputEnvelope
    set?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    disconnect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    delete?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
    update?: SeminarParticipantUpdateWithWhereUniqueWithoutSeminarInput | SeminarParticipantUpdateWithWhereUniqueWithoutSeminarInput[]
    updateMany?: SeminarParticipantUpdateManyWithWhereWithoutSeminarInput | SeminarParticipantUpdateManyWithWhereWithoutSeminarInput[]
    deleteMany?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
  }

  export type SeminarCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<SeminarCreateWithoutParticipantsInput, SeminarUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: SeminarCreateOrConnectWithoutParticipantsInput
    connect?: SeminarWhereUniqueInput
  }

  export type AccountCreateNestedOneWithoutSeminarsInput = {
    create?: XOR<AccountCreateWithoutSeminarsInput, AccountUncheckedCreateWithoutSeminarsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSeminarsInput
    connect?: AccountWhereUniqueInput
  }

  export type Enumparticipant_statusFieldUpdateOperationsInput = {
    set?: $Enums.participant_status
  }

  export type SeminarUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<SeminarCreateWithoutParticipantsInput, SeminarUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: SeminarCreateOrConnectWithoutParticipantsInput
    upsert?: SeminarUpsertWithoutParticipantsInput
    connect?: SeminarWhereUniqueInput
    update?: XOR<XOR<SeminarUpdateToOneWithWhereWithoutParticipantsInput, SeminarUpdateWithoutParticipantsInput>, SeminarUncheckedUpdateWithoutParticipantsInput>
  }

  export type AccountUpdateOneRequiredWithoutSeminarsNestedInput = {
    create?: XOR<AccountCreateWithoutSeminarsInput, AccountUncheckedCreateWithoutSeminarsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSeminarsInput
    upsert?: AccountUpsertWithoutSeminarsInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutSeminarsInput, AccountUpdateWithoutSeminarsInput>, AccountUncheckedUpdateWithoutSeminarsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumaccessFilter<$PrismaModel = never> = {
    equals?: $Enums.access | EnumaccessFieldRefInput<$PrismaModel>
    in?: $Enums.access[]
    notIn?: $Enums.access[]
    not?: NestedEnumaccessFilter<$PrismaModel> | $Enums.access
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumgenderFilter<$PrismaModel = never> = {
    equals?: $Enums.gender | EnumgenderFieldRefInput<$PrismaModel>
    in?: $Enums.gender[]
    notIn?: $Enums.gender[]
    not?: NestedEnumgenderFilter<$PrismaModel> | $Enums.gender
  }

  export type NestedEnumclient_profileFilter<$PrismaModel = never> = {
    equals?: $Enums.client_profile | Enumclient_profileFieldRefInput<$PrismaModel>
    in?: $Enums.client_profile[]
    notIn?: $Enums.client_profile[]
    not?: NestedEnumclient_profileFilter<$PrismaModel> | $Enums.client_profile
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumaccessWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.access | EnumaccessFieldRefInput<$PrismaModel>
    in?: $Enums.access[]
    notIn?: $Enums.access[]
    not?: NestedEnumaccessWithAggregatesFilter<$PrismaModel> | $Enums.access
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaccessFilter<$PrismaModel>
    _max?: NestedEnumaccessFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumgenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.gender | EnumgenderFieldRefInput<$PrismaModel>
    in?: $Enums.gender[]
    notIn?: $Enums.gender[]
    not?: NestedEnumgenderWithAggregatesFilter<$PrismaModel> | $Enums.gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumgenderFilter<$PrismaModel>
    _max?: NestedEnumgenderFilter<$PrismaModel>
  }

  export type NestedEnumclient_profileWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.client_profile | Enumclient_profileFieldRefInput<$PrismaModel>
    in?: $Enums.client_profile[]
    notIn?: $Enums.client_profile[]
    not?: NestedEnumclient_profileWithAggregatesFilter<$PrismaModel> | $Enums.client_profile
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumclient_profileFilter<$PrismaModel>
    _max?: NestedEnumclient_profileFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumitem_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.item_status | Enumitem_statusFieldRefInput<$PrismaModel>
    in?: $Enums.item_status[]
    notIn?: $Enums.item_status[]
    not?: NestedEnumitem_statusFilter<$PrismaModel> | $Enums.item_status
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumitem_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.item_status | Enumitem_statusFieldRefInput<$PrismaModel>
    in?: $Enums.item_status[]
    notIn?: $Enums.item_status[]
    not?: NestedEnumitem_statusWithAggregatesFilter<$PrismaModel> | $Enums.item_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumitem_statusFilter<$PrismaModel>
    _max?: NestedEnumitem_statusFilter<$PrismaModel>
  }

  export type NestedEnumseminar_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.seminar_status | Enumseminar_statusFieldRefInput<$PrismaModel>
    in?: $Enums.seminar_status[]
    notIn?: $Enums.seminar_status[]
    not?: NestedEnumseminar_statusFilter<$PrismaModel> | $Enums.seminar_status
  }

  export type NestedEnumseminar_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.seminar_status | Enumseminar_statusFieldRefInput<$PrismaModel>
    in?: $Enums.seminar_status[]
    notIn?: $Enums.seminar_status[]
    not?: NestedEnumseminar_statusWithAggregatesFilter<$PrismaModel> | $Enums.seminar_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumseminar_statusFilter<$PrismaModel>
    _max?: NestedEnumseminar_statusFilter<$PrismaModel>
  }

  export type NestedEnumparticipant_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.participant_status | Enumparticipant_statusFieldRefInput<$PrismaModel>
    in?: $Enums.participant_status[]
    notIn?: $Enums.participant_status[]
    not?: NestedEnumparticipant_statusFilter<$PrismaModel> | $Enums.participant_status
  }

  export type NestedEnumparticipant_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.participant_status | Enumparticipant_statusFieldRefInput<$PrismaModel>
    in?: $Enums.participant_status[]
    notIn?: $Enums.participant_status[]
    not?: NestedEnumparticipant_statusWithAggregatesFilter<$PrismaModel> | $Enums.participant_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumparticipant_statusFilter<$PrismaModel>
    _max?: NestedEnumparticipant_statusFilter<$PrismaModel>
  }

  export type AccountCommodityCreateWithoutAccountInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutAccountsInput
  }

  export type AccountCommodityUncheckedCreateWithoutAccountInput = {
    id?: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityCreateOrConnectWithoutAccountInput = {
    where: AccountCommodityWhereUniqueInput
    create: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput>
  }

  export type AccountCommodityCreateManyAccountInputEnvelope = {
    data: AccountCommodityCreateManyAccountInput | AccountCommodityCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type SeminarParticipantCreateWithoutAccountInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    seminar: SeminarCreateNestedOneWithoutParticipantsInput
  }

  export type SeminarParticipantUncheckedCreateWithoutAccountInput = {
    id?: string
    seminar_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantCreateOrConnectWithoutAccountInput = {
    where: SeminarParticipantWhereUniqueInput
    create: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput>
  }

  export type SeminarParticipantCreateManyAccountInputEnvelope = {
    data: SeminarParticipantCreateManyAccountInput | SeminarParticipantCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type AccountCommodityUpsertWithWhereUniqueWithoutAccountInput = {
    where: AccountCommodityWhereUniqueInput
    update: XOR<AccountCommodityUpdateWithoutAccountInput, AccountCommodityUncheckedUpdateWithoutAccountInput>
    create: XOR<AccountCommodityCreateWithoutAccountInput, AccountCommodityUncheckedCreateWithoutAccountInput>
  }

  export type AccountCommodityUpdateWithWhereUniqueWithoutAccountInput = {
    where: AccountCommodityWhereUniqueInput
    data: XOR<AccountCommodityUpdateWithoutAccountInput, AccountCommodityUncheckedUpdateWithoutAccountInput>
  }

  export type AccountCommodityUpdateManyWithWhereWithoutAccountInput = {
    where: AccountCommodityScalarWhereInput
    data: XOR<AccountCommodityUpdateManyMutationInput, AccountCommodityUncheckedUpdateManyWithoutAccountInput>
  }

  export type AccountCommodityScalarWhereInput = {
    AND?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
    OR?: AccountCommodityScalarWhereInput[]
    NOT?: AccountCommodityScalarWhereInput | AccountCommodityScalarWhereInput[]
    id?: StringFilter<"AccountCommodity"> | string
    account_id?: StringFilter<"AccountCommodity"> | string
    commodity_id?: StringFilter<"AccountCommodity"> | string
    createdAt?: DateTimeFilter<"AccountCommodity"> | Date | string
    updatedAt?: DateTimeFilter<"AccountCommodity"> | Date | string
  }

  export type SeminarParticipantUpsertWithWhereUniqueWithoutAccountInput = {
    where: SeminarParticipantWhereUniqueInput
    update: XOR<SeminarParticipantUpdateWithoutAccountInput, SeminarParticipantUncheckedUpdateWithoutAccountInput>
    create: XOR<SeminarParticipantCreateWithoutAccountInput, SeminarParticipantUncheckedCreateWithoutAccountInput>
  }

  export type SeminarParticipantUpdateWithWhereUniqueWithoutAccountInput = {
    where: SeminarParticipantWhereUniqueInput
    data: XOR<SeminarParticipantUpdateWithoutAccountInput, SeminarParticipantUncheckedUpdateWithoutAccountInput>
  }

  export type SeminarParticipantUpdateManyWithWhereWithoutAccountInput = {
    where: SeminarParticipantScalarWhereInput
    data: XOR<SeminarParticipantUpdateManyMutationInput, SeminarParticipantUncheckedUpdateManyWithoutAccountInput>
  }

  export type SeminarParticipantScalarWhereInput = {
    AND?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
    OR?: SeminarParticipantScalarWhereInput[]
    NOT?: SeminarParticipantScalarWhereInput | SeminarParticipantScalarWhereInput[]
    id?: StringFilter<"SeminarParticipant"> | string
    seminar_id?: StringFilter<"SeminarParticipant"> | string
    account_id?: StringFilter<"SeminarParticipant"> | string
    status?: Enumparticipant_statusFilter<"SeminarParticipant"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
    updatedAt?: DateTimeFilter<"SeminarParticipant"> | Date | string
  }

  export type AccountCommodityCreateWithoutCommodityInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutCommodityInput
  }

  export type AccountCommodityUncheckedCreateWithoutCommodityInput = {
    id?: string
    account_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityCreateOrConnectWithoutCommodityInput = {
    where: AccountCommodityWhereUniqueInput
    create: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput>
  }

  export type AccountCommodityCreateManyCommodityInputEnvelope = {
    data: AccountCommodityCreateManyCommodityInput | AccountCommodityCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type AccountCommodityUpsertWithWhereUniqueWithoutCommodityInput = {
    where: AccountCommodityWhereUniqueInput
    update: XOR<AccountCommodityUpdateWithoutCommodityInput, AccountCommodityUncheckedUpdateWithoutCommodityInput>
    create: XOR<AccountCommodityCreateWithoutCommodityInput, AccountCommodityUncheckedCreateWithoutCommodityInput>
  }

  export type AccountCommodityUpdateWithWhereUniqueWithoutCommodityInput = {
    where: AccountCommodityWhereUniqueInput
    data: XOR<AccountCommodityUpdateWithoutCommodityInput, AccountCommodityUncheckedUpdateWithoutCommodityInput>
  }

  export type AccountCommodityUpdateManyWithWhereWithoutCommodityInput = {
    where: AccountCommodityScalarWhereInput
    data: XOR<AccountCommodityUpdateManyMutationInput, AccountCommodityUncheckedUpdateManyWithoutCommodityInput>
  }

  export type CommodityCreateWithoutAccountsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommodityUncheckedCreateWithoutAccountsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommodityCreateOrConnectWithoutAccountsInput = {
    where: CommodityWhereUniqueInput
    create: XOR<CommodityCreateWithoutAccountsInput, CommodityUncheckedCreateWithoutAccountsInput>
  }

  export type AccountCreateWithoutCommodityInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutCommodityInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutCommodityInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutCommodityInput, AccountUncheckedCreateWithoutCommodityInput>
  }

  export type CommodityUpsertWithoutAccountsInput = {
    update: XOR<CommodityUpdateWithoutAccountsInput, CommodityUncheckedUpdateWithoutAccountsInput>
    create: XOR<CommodityCreateWithoutAccountsInput, CommodityUncheckedCreateWithoutAccountsInput>
    where?: CommodityWhereInput
  }

  export type CommodityUpdateToOneWithWhereWithoutAccountsInput = {
    where?: CommodityWhereInput
    data: XOR<CommodityUpdateWithoutAccountsInput, CommodityUncheckedUpdateWithoutAccountsInput>
  }

  export type CommodityUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommodityUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpsertWithoutCommodityInput = {
    update: XOR<AccountUpdateWithoutCommodityInput, AccountUncheckedUpdateWithoutCommodityInput>
    create: XOR<AccountCreateWithoutCommodityInput, AccountUncheckedCreateWithoutCommodityInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutCommodityInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutCommodityInput, AccountUncheckedUpdateWithoutCommodityInput>
  }

  export type AccountUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type ItemStackCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUncheckedCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackCreateOrConnectWithoutItemInput = {
    where: ItemStackWhereUniqueInput
    create: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput>
  }

  export type ItemStackCreateManyItemInputEnvelope = {
    data: ItemStackCreateManyItemInput | ItemStackCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type InventoryCategoryCreateWithoutItemsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryCategoryUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryCategoryCreateOrConnectWithoutItemsInput = {
    where: InventoryCategoryWhereUniqueInput
    create: XOR<InventoryCategoryCreateWithoutItemsInput, InventoryCategoryUncheckedCreateWithoutItemsInput>
  }

  export type ItemStackUpsertWithWhereUniqueWithoutItemInput = {
    where: ItemStackWhereUniqueInput
    update: XOR<ItemStackUpdateWithoutItemInput, ItemStackUncheckedUpdateWithoutItemInput>
    create: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput>
  }

  export type ItemStackUpdateWithWhereUniqueWithoutItemInput = {
    where: ItemStackWhereUniqueInput
    data: XOR<ItemStackUpdateWithoutItemInput, ItemStackUncheckedUpdateWithoutItemInput>
  }

  export type ItemStackUpdateManyWithWhereWithoutItemInput = {
    where: ItemStackScalarWhereInput
    data: XOR<ItemStackUpdateManyMutationInput, ItemStackUncheckedUpdateManyWithoutItemInput>
  }

  export type ItemStackScalarWhereInput = {
    AND?: ItemStackScalarWhereInput | ItemStackScalarWhereInput[]
    OR?: ItemStackScalarWhereInput[]
    NOT?: ItemStackScalarWhereInput | ItemStackScalarWhereInput[]
    id?: StringFilter<"ItemStack"> | string
    itemId?: StringFilter<"ItemStack"> | string
    quantity?: IntFilter<"ItemStack"> | number
    status?: Enumitem_statusFilter<"ItemStack"> | $Enums.item_status
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
  }

  export type InventoryCategoryUpsertWithoutItemsInput = {
    update: XOR<InventoryCategoryUpdateWithoutItemsInput, InventoryCategoryUncheckedUpdateWithoutItemsInput>
    create: XOR<InventoryCategoryCreateWithoutItemsInput, InventoryCategoryUncheckedCreateWithoutItemsInput>
    where?: InventoryCategoryWhereInput
  }

  export type InventoryCategoryUpdateToOneWithWhereWithoutItemsInput = {
    where?: InventoryCategoryWhereInput
    data: XOR<InventoryCategoryUpdateWithoutItemsInput, InventoryCategoryUncheckedUpdateWithoutItemsInput>
  }

  export type InventoryCategoryUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCategoryUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackCreateNestedManyWithoutItemInput
  }

  export type InventoryItemUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackUncheckedCreateNestedManyWithoutItemInput
  }

  export type InventoryItemCreateOrConnectWithoutCategoryInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput>
  }

  export type InventoryItemCreateManyCategoryInputEnvelope = {
    data: InventoryItemCreateManyCategoryInput | InventoryItemCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type InventoryItemUpsertWithWhereUniqueWithoutCategoryInput = {
    where: InventoryItemWhereUniqueInput
    update: XOR<InventoryItemUpdateWithoutCategoryInput, InventoryItemUncheckedUpdateWithoutCategoryInput>
    create: XOR<InventoryItemCreateWithoutCategoryInput, InventoryItemUncheckedCreateWithoutCategoryInput>
  }

  export type InventoryItemUpdateWithWhereUniqueWithoutCategoryInput = {
    where: InventoryItemWhereUniqueInput
    data: XOR<InventoryItemUpdateWithoutCategoryInput, InventoryItemUncheckedUpdateWithoutCategoryInput>
  }

  export type InventoryItemUpdateManyWithWhereWithoutCategoryInput = {
    where: InventoryItemScalarWhereInput
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyWithoutCategoryInput>
  }

  export type InventoryItemScalarWhereInput = {
    AND?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    OR?: InventoryItemScalarWhereInput[]
    NOT?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    id?: StringFilter<"InventoryItem"> | string
    name?: StringFilter<"InventoryItem"> | string
    description?: StringNullableFilter<"InventoryItem"> | string | null
    categoryId?: StringFilter<"InventoryItem"> | string
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
  }

  export type InventoryItemCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: InventoryCategoryCreateNestedOneWithoutItemsInput
  }

  export type InventoryItemUncheckedCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemCreateOrConnectWithoutItem_stacksInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
  }

  export type InventoryItemUpsertWithoutItem_stacksInput = {
    update: XOR<InventoryItemUpdateWithoutItem_stacksInput, InventoryItemUncheckedUpdateWithoutItem_stacksInput>
    create: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
    where?: InventoryItemWhereInput
  }

  export type InventoryItemUpdateToOneWithWhereWithoutItem_stacksInput = {
    where?: InventoryItemWhereInput
    data: XOR<InventoryItemUpdateWithoutItem_stacksInput, InventoryItemUncheckedUpdateWithoutItem_stacksInput>
  }

  export type InventoryItemUpdateWithoutItem_stacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: InventoryCategoryUpdateOneRequiredWithoutItemsNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutItem_stacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantCreateWithoutSeminarInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutSeminarsInput
  }

  export type SeminarParticipantUncheckedCreateWithoutSeminarInput = {
    id?: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantCreateOrConnectWithoutSeminarInput = {
    where: SeminarParticipantWhereUniqueInput
    create: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput>
  }

  export type SeminarParticipantCreateManySeminarInputEnvelope = {
    data: SeminarParticipantCreateManySeminarInput | SeminarParticipantCreateManySeminarInput[]
    skipDuplicates?: boolean
  }

  export type SeminarParticipantUpsertWithWhereUniqueWithoutSeminarInput = {
    where: SeminarParticipantWhereUniqueInput
    update: XOR<SeminarParticipantUpdateWithoutSeminarInput, SeminarParticipantUncheckedUpdateWithoutSeminarInput>
    create: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput>
  }

  export type SeminarParticipantUpdateWithWhereUniqueWithoutSeminarInput = {
    where: SeminarParticipantWhereUniqueInput
    data: XOR<SeminarParticipantUpdateWithoutSeminarInput, SeminarParticipantUncheckedUpdateWithoutSeminarInput>
  }

  export type SeminarParticipantUpdateManyWithWhereWithoutSeminarInput = {
    where: SeminarParticipantScalarWhereInput
    data: XOR<SeminarParticipantUpdateManyMutationInput, SeminarParticipantUncheckedUpdateManyWithoutSeminarInput>
  }

  export type SeminarCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: Date | string
    end_time: Date | string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarUncheckedCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: Date | string
    end_time: Date | string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    photo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarCreateOrConnectWithoutParticipantsInput = {
    where: SeminarWhereUniqueInput
    create: XOR<SeminarCreateWithoutParticipantsInput, SeminarUncheckedCreateWithoutParticipantsInput>
  }

  export type AccountCreateWithoutSeminarsInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateWithoutSeminarsInput = {
    id?: string
    access?: $Enums.access
    username: string
    email: string
    firstName: string
    lastName: string
    middleName?: string | null
    gender: $Enums.gender
    client_profile?: $Enums.client_profile
    cellphone_no?: string | null
    telephone_no?: string | null
    occupation?: string | null
    position?: string | null
    address?: string | null
    picture?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountCreateOrConnectWithoutSeminarsInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutSeminarsInput, AccountUncheckedCreateWithoutSeminarsInput>
  }

  export type SeminarUpsertWithoutParticipantsInput = {
    update: XOR<SeminarUpdateWithoutParticipantsInput, SeminarUncheckedUpdateWithoutParticipantsInput>
    create: XOR<SeminarCreateWithoutParticipantsInput, SeminarUncheckedCreateWithoutParticipantsInput>
    where?: SeminarWhereInput
  }

  export type SeminarUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: SeminarWhereInput
    data: XOR<SeminarUpdateWithoutParticipantsInput, SeminarUncheckedUpdateWithoutParticipantsInput>
  }

  export type SeminarUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: DateTimeFieldUpdateOperationsInput | Date | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    photo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpsertWithoutSeminarsInput = {
    update: XOR<AccountUpdateWithoutSeminarsInput, AccountUncheckedUpdateWithoutSeminarsInput>
    create: XOR<AccountCreateWithoutSeminarsInput, AccountUncheckedCreateWithoutSeminarsInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutSeminarsInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutSeminarsInput, AccountUncheckedUpdateWithoutSeminarsInput>
  }

  export type AccountUpdateWithoutSeminarsInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateWithoutSeminarsInput = {
    id?: StringFieldUpdateOperationsInput | string
    access?: EnumaccessFieldUpdateOperationsInput | $Enums.access
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: EnumgenderFieldUpdateOperationsInput | $Enums.gender
    client_profile?: Enumclient_profileFieldUpdateOperationsInput | $Enums.client_profile
    cellphone_no?: NullableStringFieldUpdateOperationsInput | string | null
    telephone_no?: NullableStringFieldUpdateOperationsInput | string | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountCommodityCreateManyAccountInput = {
    id?: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantCreateManyAccountInput = {
    id?: string
    seminar_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountCommodityUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminar?: SeminarUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type SeminarParticipantUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityCreateManyCommodityInput = {
    id?: string
    account_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCommodityUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutCommodityNestedInput
  }

  export type AccountCommodityUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCommodityUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackCreateManyItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUpdateManyWithoutItemNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUncheckedUpdateManyWithoutItemNestedInput
  }

  export type InventoryItemUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantCreateManySeminarInput = {
    id?: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarParticipantUpdateWithoutSeminarInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutSeminarsNestedInput
  }

  export type SeminarParticipantUncheckedUpdateWithoutSeminarInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarParticipantUncheckedUpdateManyWithoutSeminarInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}