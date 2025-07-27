
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
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model InventoryItem
 * 
 */
export type InventoryItem = $Result.DefaultSelection<Prisma.$InventoryItemPayload>
/**
 * Model ItemStack
 * 
 */
export type ItemStack = $Result.DefaultSelection<Prisma.$ItemStackPayload>
/**
 * Model ItemTransaction
 * 
 */
export type ItemTransaction = $Result.DefaultSelection<Prisma.$ItemTransactionPayload>
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


export const audit_action: {
  ACCOUNT_CREATE: 'ACCOUNT_CREATE',
  ACCOUNT_UPDATE: 'ACCOUNT_UPDATE',
  ACCOUNT_DELETE: 'ACCOUNT_DELETE',
  ACCOUNT_ROLE_CHANGE: 'ACCOUNT_ROLE_CHANGE',
  ACCOUNT_STATUS_CHANGE: 'ACCOUNT_STATUS_CHANGE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  INVENTORY_CREATE: 'INVENTORY_CREATE',
  INVENTORY_UPDATE: 'INVENTORY_UPDATE',
  INVENTORY_DELETE: 'INVENTORY_DELETE',
  INVENTORY_STATUS_CHANGE: 'INVENTORY_STATUS_CHANGE',
  DISTRIBUTION_CREATE: 'DISTRIBUTION_CREATE',
  DISTRIBUTION_UPDATE: 'DISTRIBUTION_UPDATE',
  DISTRIBUTION_DELETE: 'DISTRIBUTION_DELETE',
  DISTRIBUTION_REQUEST_APPROVE: 'DISTRIBUTION_REQUEST_APPROVE',
  DISTRIBUTION_REQUEST_REJECT: 'DISTRIBUTION_REQUEST_REJECT',
  DISTRIBUTION_REQUEST_NO_PICKUP: 'DISTRIBUTION_REQUEST_NO_PICKUP',
  EIC_CREATE: 'EIC_CREATE',
  EIC_UPDATE: 'EIC_UPDATE',
  EIC_DELETE: 'EIC_DELETE',
  EIC_STATUS_CHANGE: 'EIC_STATUS_CHANGE',
  EIC_REQUEST_APPROVE: 'EIC_REQUEST_APPROVE',
  EIC_REQUEST_REJECT: 'EIC_REQUEST_REJECT',
  EIC_REQUEST_NO_PICKUP: 'EIC_REQUEST_NO_PICKUP',
  SEMINAR_CREATE: 'SEMINAR_CREATE',
  SEMINAR_UPDATE: 'SEMINAR_UPDATE',
  SEMINAR_DELETE: 'SEMINAR_DELETE',
  SEMINAR_STATUS_CHANGE: 'SEMINAR_STATUS_CHANGE',
  SEMINAR_PARTICIPANT_UPDATE: 'SEMINAR_PARTICIPANT_UPDATE',
  CONTENT_CREATE: 'CONTENT_CREATE',
  CONTENT_UPDATE: 'CONTENT_UPDATE',
  CONTENT_DELETE: 'CONTENT_DELETE',
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
  SYSTEM_RESTORE: 'SYSTEM_RESTORE',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_PICTURE_UPDATE: 'PROFILE_PICTURE_UPDATE',
  SETTINGS_UPDATE: 'SETTINGS_UPDATE'
};

export type audit_action = (typeof audit_action)[keyof typeof audit_action]


export const transaction_status: {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Returned: 'Returned',
  No_Return: 'No_Return',
  late_return: 'late_return',
  No_Pickup: 'No_Pickup',
  Cancelled: 'Cancelled'
};

export type transaction_status = (typeof transaction_status)[keyof typeof transaction_status]


export const item_status: {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Damaged: 'Damaged',
  EIC: 'EIC',
  Distributed: 'Distributed'
};

export type item_status = (typeof item_status)[keyof typeof item_status]


export const item_category: {
  Farming_Equipment: 'Farming_Equipment',
  Harvesting_Tools: 'Harvesting_Tools',
  Irrigation_Systems: 'Irrigation_Systems',
  Storage_Equipment: 'Storage_Equipment',
  Processing_Equipment: 'Processing_Equipment',
  Safety_Gear: 'Safety_Gear',
  Pest_Control: 'Pest_Control',
  Livestock_Equipment: 'Livestock_Equipment',
  Measuring_Tools: 'Measuring_Tools',
  Fisheries: 'Fisheries',
  Machinery: 'Machinery',
  Other: 'Other'
};

export type item_category = (typeof item_category)[keyof typeof item_category]


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

export type audit_action = $Enums.audit_action

export const audit_action: typeof $Enums.audit_action

export type transaction_status = $Enums.transaction_status

export const transaction_status: typeof $Enums.transaction_status

export type item_status = $Enums.item_status

export const item_status: typeof $Enums.item_status

export type item_category = $Enums.item_category

export const item_category: typeof $Enums.item_category

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
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.itemStack`: Exposes CRUD operations for the **ItemStack** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemStacks
    * const itemStacks = await prisma.itemStack.findMany()
    * ```
    */
  get itemStack(): Prisma.ItemStackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itemTransaction`: Exposes CRUD operations for the **ItemTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemTransactions
    * const itemTransactions = await prisma.itemTransaction.findMany()
    * ```
    */
  get itemTransaction(): Prisma.ItemTransactionDelegate<ExtArgs, ClientOptions>;

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
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
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
    AuditLog: 'AuditLog',
    InventoryItem: 'InventoryItem',
    ItemStack: 'ItemStack',
    ItemTransaction: 'ItemTransaction',
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
      modelProps: "account" | "commodity" | "accountCommodity" | "auditLog" | "inventoryItem" | "itemStack" | "itemTransaction" | "seminar" | "seminarParticipant"
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
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
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
      ItemTransaction: {
        payload: Prisma.$ItemTransactionPayload<ExtArgs>
        fields: Prisma.ItemTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          findFirst: {
            args: Prisma.ItemTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          findMany: {
            args: Prisma.ItemTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>[]
          }
          create: {
            args: Prisma.ItemTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          createMany: {
            args: Prisma.ItemTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ItemTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          update: {
            args: Prisma.ItemTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          deleteMany: {
            args: Prisma.ItemTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemTransactionPayload>
          }
          aggregate: {
            args: Prisma.ItemTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemTransaction>
          }
          groupBy: {
            args: Prisma.ItemTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<ItemTransactionCountAggregateOutputType> | number
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
    auditLog?: AuditLogOmit
    inventoryItem?: InventoryItemOmit
    itemStack?: ItemStackOmit
    itemTransaction?: ItemTransactionOmit
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
    itemTransactions: number
    adminTransactions: number
    seminarsCreated: number
    auditLogs: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | AccountCountOutputTypeCountCommodityArgs
    seminars?: boolean | AccountCountOutputTypeCountSeminarsArgs
    itemTransactions?: boolean | AccountCountOutputTypeCountItemTransactionsArgs
    adminTransactions?: boolean | AccountCountOutputTypeCountAdminTransactionsArgs
    seminarsCreated?: boolean | AccountCountOutputTypeCountSeminarsCreatedArgs
    auditLogs?: boolean | AccountCountOutputTypeCountAuditLogsArgs
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
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountItemTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemTransactionWhereInput
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAdminTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemTransactionWhereInput
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountSeminarsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeminarWhereInput
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
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
   * Count Type ItemStackCountOutputType
   */

  export type ItemStackCountOutputType = {
    itemTransactions: number
  }

  export type ItemStackCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itemTransactions?: boolean | ItemStackCountOutputTypeCountItemTransactionsArgs
  }

  // Custom InputTypes
  /**
   * ItemStackCountOutputType without action
   */
  export type ItemStackCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemStackCountOutputType
     */
    select?: ItemStackCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemStackCountOutputType without action
   */
  export type ItemStackCountOutputTypeCountItemTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemTransactionWhereInput
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
    institution: string | null
    address: string | null
    picture: Uint8Array | null
    mimeType: string | null
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
    institution: string | null
    address: string | null
    picture: Uint8Array | null
    mimeType: string | null
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
    institution: number
    address: number
    picture: number
    mimeType: number
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
    institution?: true
    address?: true
    picture?: true
    mimeType?: true
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
    institution?: true
    address?: true
    picture?: true
    mimeType?: true
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
    institution?: true
    address?: true
    picture?: true
    mimeType?: true
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
    institution: string | null
    address: string | null
    picture: Uint8Array | null
    mimeType: string | null
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
    institution?: boolean
    address?: boolean
    picture?: boolean
    mimeType?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commodity?: boolean | Account$commodityArgs<ExtArgs>
    seminars?: boolean | Account$seminarsArgs<ExtArgs>
    itemTransactions?: boolean | Account$itemTransactionsArgs<ExtArgs>
    adminTransactions?: boolean | Account$adminTransactionsArgs<ExtArgs>
    seminarsCreated?: boolean | Account$seminarsCreatedArgs<ExtArgs>
    auditLogs?: boolean | Account$auditLogsArgs<ExtArgs>
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
    institution?: boolean
    address?: boolean
    picture?: boolean
    mimeType?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "access" | "username" | "email" | "firstName" | "lastName" | "middleName" | "gender" | "client_profile" | "cellphone_no" | "telephone_no" | "occupation" | "position" | "institution" | "address" | "picture" | "mimeType" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | Account$commodityArgs<ExtArgs>
    seminars?: boolean | Account$seminarsArgs<ExtArgs>
    itemTransactions?: boolean | Account$itemTransactionsArgs<ExtArgs>
    adminTransactions?: boolean | Account$adminTransactionsArgs<ExtArgs>
    seminarsCreated?: boolean | Account$seminarsCreatedArgs<ExtArgs>
    auditLogs?: boolean | Account$auditLogsArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      commodity: Prisma.$AccountCommodityPayload<ExtArgs>[]
      seminars: Prisma.$SeminarParticipantPayload<ExtArgs>[]
      itemTransactions: Prisma.$ItemTransactionPayload<ExtArgs>[]
      adminTransactions: Prisma.$ItemTransactionPayload<ExtArgs>[]
      seminarsCreated: Prisma.$SeminarPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
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
      institution: string | null
      address: string | null
      picture: Uint8Array | null
      mimeType: string | null
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
    itemTransactions<T extends Account$itemTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Account$itemTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    adminTransactions<T extends Account$adminTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Account$adminTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seminarsCreated<T extends Account$seminarsCreatedArgs<ExtArgs> = {}>(args?: Subset<T, Account$seminarsCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeminarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends Account$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Account$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly institution: FieldRef<"Account", 'String'>
    readonly address: FieldRef<"Account", 'String'>
    readonly picture: FieldRef<"Account", 'Bytes'>
    readonly mimeType: FieldRef<"Account", 'String'>
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
   * Account.itemTransactions
   */
  export type Account$itemTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    where?: ItemTransactionWhereInput
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    cursor?: ItemTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
  }

  /**
   * Account.adminTransactions
   */
  export type Account$adminTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    where?: ItemTransactionWhereInput
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    cursor?: ItemTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
  }

  /**
   * Account.seminarsCreated
   */
  export type Account$seminarsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    where?: SeminarWhereInput
    orderBy?: SeminarOrderByWithRelationInput | SeminarOrderByWithRelationInput[]
    cursor?: SeminarWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SeminarScalarFieldEnum | SeminarScalarFieldEnum[]
  }

  /**
   * Account.auditLogs
   */
  export type Account$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
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
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    adminId: string | null
    action: $Enums.audit_action | null
    targetType: string | null
    targetId: string | null
    targetName: string | null
    details: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    adminId: string | null
    action: $Enums.audit_action | null
    targetType: string | null
    targetId: string | null
    targetName: string | null
    details: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    adminId: number
    action: number
    targetType: number
    targetId: number
    targetName: number
    details: number
    metadata: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    targetName?: true
    details?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    targetName?: true
    details?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    targetName?: true
    details?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    adminId: string
    action: $Enums.audit_action
    targetType: string | null
    targetId: string | null
    targetName: string | null
    details: string | null
    metadata: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    targetName?: boolean
    details?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    admin?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>



  export type AuditLogSelectScalar = {
    id?: boolean
    adminId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    targetName?: boolean
    details?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "adminId" | "action" | "targetType" | "targetId" | "targetName" | "details" | "metadata" | "ipAddress" | "userAgent" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      admin: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      adminId: string
      action: $Enums.audit_action
      targetType: string | null
      targetId: string | null
      targetName: string | null
      details: string | null
      metadata: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admin<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly adminId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'audit_action'>
    readonly targetType: FieldRef<"AuditLog", 'String'>
    readonly targetId: FieldRef<"AuditLog", 'String'>
    readonly targetName: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
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
    picture: Uint8Array | null
    category: $Enums.item_category | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    picture: Uint8Array | null
    category: $Enums.item_category | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryItemCountAggregateOutputType = {
    id: number
    name: number
    description: number
    picture: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryItemMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    picture?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    picture?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryItemCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    picture?: true
    category?: true
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
    picture: Uint8Array | null
    category: $Enums.item_category
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
    picture?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item_stacks?: boolean | InventoryItem$item_stacksArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>



  export type InventoryItemSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    picture?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "picture" | "category" | "createdAt" | "updatedAt", ExtArgs["result"]["inventoryItem"]>
  export type InventoryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item_stacks?: boolean | InventoryItem$item_stacksArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InventoryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryItem"
    objects: {
      item_stacks: Prisma.$ItemStackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      picture: Uint8Array | null
      category: $Enums.item_category
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
    readonly picture: FieldRef<"InventoryItem", 'Bytes'>
    readonly category: FieldRef<"InventoryItem", 'item_category'>
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
    date_limit: number | null
  }

  export type ItemStackSumAggregateOutputType = {
    quantity: number | null
    date_limit: number | null
  }

  export type ItemStackMinAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    date_limit: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemStackMaxAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    date_limit: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemStackCountAggregateOutputType = {
    id: number
    itemId: number
    quantity: number
    status: number
    date_limit: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemStackAvgAggregateInputType = {
    quantity?: true
    date_limit?: true
  }

  export type ItemStackSumAggregateInputType = {
    quantity?: true
    date_limit?: true
  }

  export type ItemStackMinAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    date_limit?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemStackMaxAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    date_limit?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemStackCountAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    date_limit?: true
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
    date_limit: number | null
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
    date_limit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item?: boolean | InventoryItemDefaultArgs<ExtArgs>
    itemTransactions?: boolean | ItemStack$itemTransactionsArgs<ExtArgs>
    _count?: boolean | ItemStackCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemStack"]>



  export type ItemStackSelectScalar = {
    id?: boolean
    itemId?: boolean
    quantity?: boolean
    status?: boolean
    date_limit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemStackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemId" | "quantity" | "status" | "date_limit" | "createdAt" | "updatedAt", ExtArgs["result"]["itemStack"]>
  export type ItemStackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | InventoryItemDefaultArgs<ExtArgs>
    itemTransactions?: boolean | ItemStack$itemTransactionsArgs<ExtArgs>
    _count?: boolean | ItemStackCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ItemStackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemStack"
    objects: {
      item: Prisma.$InventoryItemPayload<ExtArgs>
      itemTransactions: Prisma.$ItemTransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemId: string
      quantity: number
      status: $Enums.item_status
      date_limit: number | null
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
    itemTransactions<T extends ItemStack$itemTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, ItemStack$itemTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly date_limit: FieldRef<"ItemStack", 'Int'>
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
   * ItemStack.itemTransactions
   */
  export type ItemStack$itemTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    where?: ItemTransactionWhereInput
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    cursor?: ItemTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
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
   * Model ItemTransaction
   */

  export type AggregateItemTransaction = {
    _count: ItemTransactionCountAggregateOutputType | null
    _avg: ItemTransactionAvgAggregateOutputType | null
    _sum: ItemTransactionSumAggregateOutputType | null
    _min: ItemTransactionMinAggregateOutputType | null
    _max: ItemTransactionMaxAggregateOutputType | null
  }

  export type ItemTransactionAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ItemTransactionSumAggregateOutputType = {
    quantity: number | null
  }

  export type ItemTransactionMinAggregateOutputType = {
    id: string | null
    itemStackId: string | null
    accountId: string | null
    adminId: string | null
    quantity: number | null
    status: $Enums.transaction_status | null
    pickupDate: Date | null
    returnDate: Date | null
    requestNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemTransactionMaxAggregateOutputType = {
    id: string | null
    itemStackId: string | null
    accountId: string | null
    adminId: string | null
    quantity: number | null
    status: $Enums.transaction_status | null
    pickupDate: Date | null
    returnDate: Date | null
    requestNote: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemTransactionCountAggregateOutputType = {
    id: number
    itemStackId: number
    accountId: number
    adminId: number
    quantity: number
    status: number
    pickupDate: number
    returnDate: number
    requestNote: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemTransactionAvgAggregateInputType = {
    quantity?: true
  }

  export type ItemTransactionSumAggregateInputType = {
    quantity?: true
  }

  export type ItemTransactionMinAggregateInputType = {
    id?: true
    itemStackId?: true
    accountId?: true
    adminId?: true
    quantity?: true
    status?: true
    pickupDate?: true
    returnDate?: true
    requestNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemTransactionMaxAggregateInputType = {
    id?: true
    itemStackId?: true
    accountId?: true
    adminId?: true
    quantity?: true
    status?: true
    pickupDate?: true
    returnDate?: true
    requestNote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemTransactionCountAggregateInputType = {
    id?: true
    itemStackId?: true
    accountId?: true
    adminId?: true
    quantity?: true
    status?: true
    pickupDate?: true
    returnDate?: true
    requestNote?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItemTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemTransaction to aggregate.
     */
    where?: ItemTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemTransactions to fetch.
     */
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemTransactions
    **/
    _count?: true | ItemTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemTransactionMaxAggregateInputType
  }

  export type GetItemTransactionAggregateType<T extends ItemTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateItemTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemTransaction[P]>
      : GetScalarType<T[P], AggregateItemTransaction[P]>
  }




  export type ItemTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemTransactionWhereInput
    orderBy?: ItemTransactionOrderByWithAggregationInput | ItemTransactionOrderByWithAggregationInput[]
    by: ItemTransactionScalarFieldEnum[] | ItemTransactionScalarFieldEnum
    having?: ItemTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemTransactionCountAggregateInputType | true
    _avg?: ItemTransactionAvgAggregateInputType
    _sum?: ItemTransactionSumAggregateInputType
    _min?: ItemTransactionMinAggregateInputType
    _max?: ItemTransactionMaxAggregateInputType
  }

  export type ItemTransactionGroupByOutputType = {
    id: string
    itemStackId: string
    accountId: string
    adminId: string | null
    quantity: number
    status: $Enums.transaction_status
    pickupDate: Date
    returnDate: Date | null
    requestNote: string | null
    createdAt: Date
    updatedAt: Date
    _count: ItemTransactionCountAggregateOutputType | null
    _avg: ItemTransactionAvgAggregateOutputType | null
    _sum: ItemTransactionSumAggregateOutputType | null
    _min: ItemTransactionMinAggregateOutputType | null
    _max: ItemTransactionMaxAggregateOutputType | null
  }

  type GetItemTransactionGroupByPayload<T extends ItemTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], ItemTransactionGroupByOutputType[P]>
        }
      >
    >


  export type ItemTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemStackId?: boolean
    accountId?: boolean
    adminId?: boolean
    quantity?: boolean
    status?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    requestNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    itemStack?: boolean | ItemStackDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
    admin?: boolean | ItemTransaction$adminArgs<ExtArgs>
  }, ExtArgs["result"]["itemTransaction"]>



  export type ItemTransactionSelectScalar = {
    id?: boolean
    itemStackId?: boolean
    accountId?: boolean
    adminId?: boolean
    quantity?: boolean
    status?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    requestNote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemStackId" | "accountId" | "adminId" | "quantity" | "status" | "pickupDate" | "returnDate" | "requestNote" | "createdAt" | "updatedAt", ExtArgs["result"]["itemTransaction"]>
  export type ItemTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itemStack?: boolean | ItemStackDefaultArgs<ExtArgs>
    account?: boolean | AccountDefaultArgs<ExtArgs>
    admin?: boolean | ItemTransaction$adminArgs<ExtArgs>
  }

  export type $ItemTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemTransaction"
    objects: {
      itemStack: Prisma.$ItemStackPayload<ExtArgs>
      account: Prisma.$AccountPayload<ExtArgs>
      admin: Prisma.$AccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemStackId: string
      accountId: string
      adminId: string | null
      quantity: number
      status: $Enums.transaction_status
      pickupDate: Date
      returnDate: Date | null
      requestNote: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["itemTransaction"]>
    composites: {}
  }

  type ItemTransactionGetPayload<S extends boolean | null | undefined | ItemTransactionDefaultArgs> = $Result.GetResult<Prisma.$ItemTransactionPayload, S>

  type ItemTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemTransactionCountAggregateInputType | true
    }

  export interface ItemTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemTransaction'], meta: { name: 'ItemTransaction' } }
    /**
     * Find zero or one ItemTransaction that matches the filter.
     * @param {ItemTransactionFindUniqueArgs} args - Arguments to find a ItemTransaction
     * @example
     * // Get one ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemTransactionFindUniqueArgs>(args: SelectSubset<T, ItemTransactionFindUniqueArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ItemTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemTransactionFindUniqueOrThrowArgs} args - Arguments to find a ItemTransaction
     * @example
     * // Get one ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionFindFirstArgs} args - Arguments to find a ItemTransaction
     * @example
     * // Get one ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemTransactionFindFirstArgs>(args?: SelectSubset<T, ItemTransactionFindFirstArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionFindFirstOrThrowArgs} args - Arguments to find a ItemTransaction
     * @example
     * // Get one ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ItemTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemTransactions
     * const itemTransactions = await prisma.itemTransaction.findMany()
     * 
     * // Get first 10 ItemTransactions
     * const itemTransactions = await prisma.itemTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemTransactionWithIdOnly = await prisma.itemTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemTransactionFindManyArgs>(args?: SelectSubset<T, ItemTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ItemTransaction.
     * @param {ItemTransactionCreateArgs} args - Arguments to create a ItemTransaction.
     * @example
     * // Create one ItemTransaction
     * const ItemTransaction = await prisma.itemTransaction.create({
     *   data: {
     *     // ... data to create a ItemTransaction
     *   }
     * })
     * 
     */
    create<T extends ItemTransactionCreateArgs>(args: SelectSubset<T, ItemTransactionCreateArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ItemTransactions.
     * @param {ItemTransactionCreateManyArgs} args - Arguments to create many ItemTransactions.
     * @example
     * // Create many ItemTransactions
     * const itemTransaction = await prisma.itemTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemTransactionCreateManyArgs>(args?: SelectSubset<T, ItemTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ItemTransaction.
     * @param {ItemTransactionDeleteArgs} args - Arguments to delete one ItemTransaction.
     * @example
     * // Delete one ItemTransaction
     * const ItemTransaction = await prisma.itemTransaction.delete({
     *   where: {
     *     // ... filter to delete one ItemTransaction
     *   }
     * })
     * 
     */
    delete<T extends ItemTransactionDeleteArgs>(args: SelectSubset<T, ItemTransactionDeleteArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ItemTransaction.
     * @param {ItemTransactionUpdateArgs} args - Arguments to update one ItemTransaction.
     * @example
     * // Update one ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemTransactionUpdateArgs>(args: SelectSubset<T, ItemTransactionUpdateArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ItemTransactions.
     * @param {ItemTransactionDeleteManyArgs} args - Arguments to filter ItemTransactions to delete.
     * @example
     * // Delete a few ItemTransactions
     * const { count } = await prisma.itemTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemTransactionDeleteManyArgs>(args?: SelectSubset<T, ItemTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemTransactions
     * const itemTransaction = await prisma.itemTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemTransactionUpdateManyArgs>(args: SelectSubset<T, ItemTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemTransaction.
     * @param {ItemTransactionUpsertArgs} args - Arguments to update or create a ItemTransaction.
     * @example
     * // Update or create a ItemTransaction
     * const itemTransaction = await prisma.itemTransaction.upsert({
     *   create: {
     *     // ... data to create a ItemTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemTransaction we want to update
     *   }
     * })
     */
    upsert<T extends ItemTransactionUpsertArgs>(args: SelectSubset<T, ItemTransactionUpsertArgs<ExtArgs>>): Prisma__ItemTransactionClient<$Result.GetResult<Prisma.$ItemTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ItemTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionCountArgs} args - Arguments to filter ItemTransactions to count.
     * @example
     * // Count the number of ItemTransactions
     * const count = await prisma.itemTransaction.count({
     *   where: {
     *     // ... the filter for the ItemTransactions we want to count
     *   }
     * })
    **/
    count<T extends ItemTransactionCountArgs>(
      args?: Subset<T, ItemTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemTransactionAggregateArgs>(args: Subset<T, ItemTransactionAggregateArgs>): Prisma.PrismaPromise<GetItemTransactionAggregateType<T>>

    /**
     * Group by ItemTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemTransactionGroupByArgs} args - Group by arguments.
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
      T extends ItemTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemTransactionGroupByArgs['orderBy'] }
        : { orderBy?: ItemTransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemTransaction model
   */
  readonly fields: ItemTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    itemStack<T extends ItemStackDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemStackDefaultArgs<ExtArgs>>): Prisma__ItemStackClient<$Result.GetResult<Prisma.$ItemStackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    admin<T extends ItemTransaction$adminArgs<ExtArgs> = {}>(args?: Subset<T, ItemTransaction$adminArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ItemTransaction model
   */
  interface ItemTransactionFieldRefs {
    readonly id: FieldRef<"ItemTransaction", 'String'>
    readonly itemStackId: FieldRef<"ItemTransaction", 'String'>
    readonly accountId: FieldRef<"ItemTransaction", 'String'>
    readonly adminId: FieldRef<"ItemTransaction", 'String'>
    readonly quantity: FieldRef<"ItemTransaction", 'Int'>
    readonly status: FieldRef<"ItemTransaction", 'transaction_status'>
    readonly pickupDate: FieldRef<"ItemTransaction", 'DateTime'>
    readonly returnDate: FieldRef<"ItemTransaction", 'DateTime'>
    readonly requestNote: FieldRef<"ItemTransaction", 'String'>
    readonly createdAt: FieldRef<"ItemTransaction", 'DateTime'>
    readonly updatedAt: FieldRef<"ItemTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemTransaction findUnique
   */
  export type ItemTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter, which ItemTransaction to fetch.
     */
    where: ItemTransactionWhereUniqueInput
  }

  /**
   * ItemTransaction findUniqueOrThrow
   */
  export type ItemTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter, which ItemTransaction to fetch.
     */
    where: ItemTransactionWhereUniqueInput
  }

  /**
   * ItemTransaction findFirst
   */
  export type ItemTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter, which ItemTransaction to fetch.
     */
    where?: ItemTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemTransactions to fetch.
     */
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemTransactions.
     */
    cursor?: ItemTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemTransactions.
     */
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
  }

  /**
   * ItemTransaction findFirstOrThrow
   */
  export type ItemTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter, which ItemTransaction to fetch.
     */
    where?: ItemTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemTransactions to fetch.
     */
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemTransactions.
     */
    cursor?: ItemTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemTransactions.
     */
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
  }

  /**
   * ItemTransaction findMany
   */
  export type ItemTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter, which ItemTransactions to fetch.
     */
    where?: ItemTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemTransactions to fetch.
     */
    orderBy?: ItemTransactionOrderByWithRelationInput | ItemTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemTransactions.
     */
    cursor?: ItemTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemTransactions.
     */
    skip?: number
    distinct?: ItemTransactionScalarFieldEnum | ItemTransactionScalarFieldEnum[]
  }

  /**
   * ItemTransaction create
   */
  export type ItemTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemTransaction.
     */
    data: XOR<ItemTransactionCreateInput, ItemTransactionUncheckedCreateInput>
  }

  /**
   * ItemTransaction createMany
   */
  export type ItemTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemTransactions.
     */
    data: ItemTransactionCreateManyInput | ItemTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemTransaction update
   */
  export type ItemTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemTransaction.
     */
    data: XOR<ItemTransactionUpdateInput, ItemTransactionUncheckedUpdateInput>
    /**
     * Choose, which ItemTransaction to update.
     */
    where: ItemTransactionWhereUniqueInput
  }

  /**
   * ItemTransaction updateMany
   */
  export type ItemTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemTransactions.
     */
    data: XOR<ItemTransactionUpdateManyMutationInput, ItemTransactionUncheckedUpdateManyInput>
    /**
     * Filter which ItemTransactions to update
     */
    where?: ItemTransactionWhereInput
    /**
     * Limit how many ItemTransactions to update.
     */
    limit?: number
  }

  /**
   * ItemTransaction upsert
   */
  export type ItemTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemTransaction to update in case it exists.
     */
    where: ItemTransactionWhereUniqueInput
    /**
     * In case the ItemTransaction found by the `where` argument doesn't exist, create a new ItemTransaction with this data.
     */
    create: XOR<ItemTransactionCreateInput, ItemTransactionUncheckedCreateInput>
    /**
     * In case the ItemTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemTransactionUpdateInput, ItemTransactionUncheckedUpdateInput>
  }

  /**
   * ItemTransaction delete
   */
  export type ItemTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
    /**
     * Filter which ItemTransaction to delete.
     */
    where: ItemTransactionWhereUniqueInput
  }

  /**
   * ItemTransaction deleteMany
   */
  export type ItemTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemTransactions to delete
     */
    where?: ItemTransactionWhereInput
    /**
     * Limit how many ItemTransactions to delete.
     */
    limit?: number
  }

  /**
   * ItemTransaction.admin
   */
  export type ItemTransaction$adminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    where?: AccountWhereInput
  }

  /**
   * ItemTransaction without action
   */
  export type ItemTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemTransaction
     */
    select?: ItemTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemTransaction
     */
    omit?: ItemTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemTransactionInclude<ExtArgs> | null
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
    start_time: string | null
    end_time: string | null
    capacity: number | null
    registration_deadline: Date | null
    status: $Enums.seminar_status | null
    picture: Uint8Array | null
    mimeType: string | null
    createdById: string | null
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
    start_time: string | null
    end_time: string | null
    capacity: number | null
    registration_deadline: Date | null
    status: $Enums.seminar_status | null
    picture: Uint8Array | null
    mimeType: string | null
    createdById: string | null
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
    picture: number
    mimeType: number
    createdById: number
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
    picture?: true
    mimeType?: true
    createdById?: true
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
    picture?: true
    mimeType?: true
    createdById?: true
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
    picture?: true
    mimeType?: true
    createdById?: true
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
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date
    status: $Enums.seminar_status
    picture: Uint8Array | null
    mimeType: string | null
    createdById: string
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
    picture?: boolean
    mimeType?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participants?: boolean | Seminar$participantsArgs<ExtArgs>
    creator?: boolean | AccountDefaultArgs<ExtArgs>
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
    picture?: boolean
    mimeType?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SeminarOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "location" | "speaker" | "start_date" | "end_date" | "start_time" | "end_time" | "capacity" | "registration_deadline" | "status" | "picture" | "mimeType" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["seminar"]>
  export type SeminarInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | Seminar$participantsArgs<ExtArgs>
    creator?: boolean | AccountDefaultArgs<ExtArgs>
    _count?: boolean | SeminarCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SeminarPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Seminar"
    objects: {
      participants: Prisma.$SeminarParticipantPayload<ExtArgs>[]
      creator: Prisma.$AccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      location: string
      speaker: string
      start_date: Date
      end_date: Date
      start_time: string
      end_time: string
      capacity: number
      registration_deadline: Date
      status: $Enums.seminar_status
      picture: Uint8Array | null
      mimeType: string | null
      createdById: string
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
    creator<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
    readonly start_time: FieldRef<"Seminar", 'String'>
    readonly end_time: FieldRef<"Seminar", 'String'>
    readonly capacity: FieldRef<"Seminar", 'Int'>
    readonly registration_deadline: FieldRef<"Seminar", 'DateTime'>
    readonly status: FieldRef<"Seminar", 'seminar_status'>
    readonly picture: FieldRef<"Seminar", 'Bytes'>
    readonly mimeType: FieldRef<"Seminar", 'String'>
    readonly createdById: FieldRef<"Seminar", 'String'>
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
    institution: 'institution',
    address: 'address',
    picture: 'picture',
    mimeType: 'mimeType',
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


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    adminId: 'adminId',
    action: 'action',
    targetType: 'targetType',
    targetId: 'targetId',
    targetName: 'targetName',
    details: 'details',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const InventoryItemScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    picture: 'picture',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum]


  export const ItemStackScalarFieldEnum: {
    id: 'id',
    itemId: 'itemId',
    quantity: 'quantity',
    status: 'status',
    date_limit: 'date_limit',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemStackScalarFieldEnum = (typeof ItemStackScalarFieldEnum)[keyof typeof ItemStackScalarFieldEnum]


  export const ItemTransactionScalarFieldEnum: {
    id: 'id',
    itemStackId: 'itemStackId',
    accountId: 'accountId',
    adminId: 'adminId',
    quantity: 'quantity',
    status: 'status',
    pickupDate: 'pickupDate',
    returnDate: 'returnDate',
    requestNote: 'requestNote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemTransactionScalarFieldEnum = (typeof ItemTransactionScalarFieldEnum)[keyof typeof ItemTransactionScalarFieldEnum]


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
    picture: 'picture',
    mimeType: 'mimeType',
    createdById: 'createdById',
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


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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
    institution: 'institution',
    address: 'address',
    mimeType: 'mimeType',
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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const AuditLogOrderByRelevanceFieldEnum: {
    id: 'id',
    adminId: 'adminId',
    targetType: 'targetType',
    targetId: 'targetId',
    targetName: 'targetName',
    details: 'details',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type AuditLogOrderByRelevanceFieldEnum = (typeof AuditLogOrderByRelevanceFieldEnum)[keyof typeof AuditLogOrderByRelevanceFieldEnum]


  export const InventoryItemOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type InventoryItemOrderByRelevanceFieldEnum = (typeof InventoryItemOrderByRelevanceFieldEnum)[keyof typeof InventoryItemOrderByRelevanceFieldEnum]


  export const ItemStackOrderByRelevanceFieldEnum: {
    id: 'id',
    itemId: 'itemId'
  };

  export type ItemStackOrderByRelevanceFieldEnum = (typeof ItemStackOrderByRelevanceFieldEnum)[keyof typeof ItemStackOrderByRelevanceFieldEnum]


  export const ItemTransactionOrderByRelevanceFieldEnum: {
    id: 'id',
    itemStackId: 'itemStackId',
    accountId: 'accountId',
    adminId: 'adminId',
    requestNote: 'requestNote'
  };

  export type ItemTransactionOrderByRelevanceFieldEnum = (typeof ItemTransactionOrderByRelevanceFieldEnum)[keyof typeof ItemTransactionOrderByRelevanceFieldEnum]


  export const SeminarOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    speaker: 'speaker',
    start_time: 'start_time',
    end_time: 'end_time',
    mimeType: 'mimeType',
    createdById: 'createdById'
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
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'audit_action'
   */
  export type Enumaudit_actionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'audit_action'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'item_category'
   */
  export type Enumitem_categoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'item_category'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'item_status'
   */
  export type Enumitem_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'item_status'>
    


  /**
   * Reference to a field of type 'transaction_status'
   */
  export type Enumtransaction_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transaction_status'>
    


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
    institution?: StringNullableFilter<"Account"> | string | null
    address?: StringNullableFilter<"Account"> | string | null
    picture?: BytesNullableFilter<"Account"> | Uint8Array | null
    mimeType?: StringNullableFilter<"Account"> | string | null
    password?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    commodity?: AccountCommodityListRelationFilter
    seminars?: SeminarParticipantListRelationFilter
    itemTransactions?: ItemTransactionListRelationFilter
    adminTransactions?: ItemTransactionListRelationFilter
    seminarsCreated?: SeminarListRelationFilter
    auditLogs?: AuditLogListRelationFilter
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
    institution?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commodity?: AccountCommodityOrderByRelationAggregateInput
    seminars?: SeminarParticipantOrderByRelationAggregateInput
    itemTransactions?: ItemTransactionOrderByRelationAggregateInput
    adminTransactions?: ItemTransactionOrderByRelationAggregateInput
    seminarsCreated?: SeminarOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
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
    institution?: StringNullableFilter<"Account"> | string | null
    address?: StringNullableFilter<"Account"> | string | null
    picture?: BytesNullableFilter<"Account"> | Uint8Array | null
    mimeType?: StringNullableFilter<"Account"> | string | null
    password?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    commodity?: AccountCommodityListRelationFilter
    seminars?: SeminarParticipantListRelationFilter
    itemTransactions?: ItemTransactionListRelationFilter
    adminTransactions?: ItemTransactionListRelationFilter
    seminarsCreated?: SeminarListRelationFilter
    auditLogs?: AuditLogListRelationFilter
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
    institution?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
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
    institution?: StringNullableWithAggregatesFilter<"Account"> | string | null
    address?: StringNullableWithAggregatesFilter<"Account"> | string | null
    picture?: BytesNullableWithAggregatesFilter<"Account"> | Uint8Array | null
    mimeType?: StringNullableWithAggregatesFilter<"Account"> | string | null
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

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    adminId?: StringFilter<"AuditLog"> | string
    action?: Enumaudit_actionFilter<"AuditLog"> | $Enums.audit_action
    targetType?: StringNullableFilter<"AuditLog"> | string | null
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    targetName?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    admin?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    targetName?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    admin?: AccountOrderByWithRelationInput
    _relevance?: AuditLogOrderByRelevanceInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    adminId?: StringFilter<"AuditLog"> | string
    action?: Enumaudit_actionFilter<"AuditLog"> | $Enums.audit_action
    targetType?: StringNullableFilter<"AuditLog"> | string | null
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    targetName?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    admin?: XOR<AccountScalarRelationFilter, AccountWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    targetName?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    adminId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: Enumaudit_actionWithAggregatesFilter<"AuditLog"> | $Enums.audit_action
    targetType?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    targetName?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type InventoryItemWhereInput = {
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    id?: StringFilter<"InventoryItem"> | string
    name?: StringFilter<"InventoryItem"> | string
    description?: StringNullableFilter<"InventoryItem"> | string | null
    picture?: BytesNullableFilter<"InventoryItem"> | Uint8Array | null
    category?: Enumitem_categoryFilter<"InventoryItem"> | $Enums.item_category
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    item_stacks?: ItemStackListRelationFilter
  }

  export type InventoryItemOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item_stacks?: ItemStackOrderByRelationAggregateInput
    _relevance?: InventoryItemOrderByRelevanceInput
  }

  export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    description?: StringNullableFilter<"InventoryItem"> | string | null
    picture?: BytesNullableFilter<"InventoryItem"> | Uint8Array | null
    category?: Enumitem_categoryFilter<"InventoryItem"> | $Enums.item_category
    createdAt?: DateTimeFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryItem"> | Date | string
    item_stacks?: ItemStackListRelationFilter
  }, "id" | "name">

  export type InventoryItemOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    category?: SortOrder
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
    picture?: BytesNullableWithAggregatesFilter<"InventoryItem"> | Uint8Array | null
    category?: Enumitem_categoryWithAggregatesFilter<"InventoryItem"> | $Enums.item_category
    createdAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
  }

  export type ItemStackWhereInput = {
    AND?: ItemStackWhereInput | ItemStackWhereInput[]
    OR?: ItemStackWhereInput[]
    NOT?: ItemStackWhereInput | ItemStackWhereInput[]
    id?: StringFilter<"ItemStack"> | string
    itemId?: StringFilter<"ItemStack"> | string
    quantity?: IntFilter<"ItemStack"> | number
    status?: Enumitem_statusFilter<"ItemStack"> | $Enums.item_status
    date_limit?: IntNullableFilter<"ItemStack"> | number | null
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
    item?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
    itemTransactions?: ItemTransactionListRelationFilter
  }

  export type ItemStackOrderByWithRelationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    date_limit?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item?: InventoryItemOrderByWithRelationInput
    itemTransactions?: ItemTransactionOrderByRelationAggregateInput
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
    date_limit?: IntNullableFilter<"ItemStack"> | number | null
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
    item?: XOR<InventoryItemScalarRelationFilter, InventoryItemWhereInput>
    itemTransactions?: ItemTransactionListRelationFilter
  }, "id">

  export type ItemStackOrderByWithAggregationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    date_limit?: SortOrderInput | SortOrder
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
    date_limit?: IntNullableWithAggregatesFilter<"ItemStack"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ItemStack"> | Date | string
  }

  export type ItemTransactionWhereInput = {
    AND?: ItemTransactionWhereInput | ItemTransactionWhereInput[]
    OR?: ItemTransactionWhereInput[]
    NOT?: ItemTransactionWhereInput | ItemTransactionWhereInput[]
    id?: StringFilter<"ItemTransaction"> | string
    itemStackId?: StringFilter<"ItemTransaction"> | string
    accountId?: StringFilter<"ItemTransaction"> | string
    adminId?: StringNullableFilter<"ItemTransaction"> | string | null
    quantity?: IntFilter<"ItemTransaction"> | number
    status?: Enumtransaction_statusFilter<"ItemTransaction"> | $Enums.transaction_status
    pickupDate?: DateTimeFilter<"ItemTransaction"> | Date | string
    returnDate?: DateTimeNullableFilter<"ItemTransaction"> | Date | string | null
    requestNote?: StringNullableFilter<"ItemTransaction"> | string | null
    createdAt?: DateTimeFilter<"ItemTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"ItemTransaction"> | Date | string
    itemStack?: XOR<ItemStackScalarRelationFilter, ItemStackWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    admin?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
  }

  export type ItemTransactionOrderByWithRelationInput = {
    id?: SortOrder
    itemStackId?: SortOrder
    accountId?: SortOrder
    adminId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    status?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrderInput | SortOrder
    requestNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    itemStack?: ItemStackOrderByWithRelationInput
    account?: AccountOrderByWithRelationInput
    admin?: AccountOrderByWithRelationInput
    _relevance?: ItemTransactionOrderByRelevanceInput
  }

  export type ItemTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ItemTransactionWhereInput | ItemTransactionWhereInput[]
    OR?: ItemTransactionWhereInput[]
    NOT?: ItemTransactionWhereInput | ItemTransactionWhereInput[]
    itemStackId?: StringFilter<"ItemTransaction"> | string
    accountId?: StringFilter<"ItemTransaction"> | string
    adminId?: StringNullableFilter<"ItemTransaction"> | string | null
    quantity?: IntFilter<"ItemTransaction"> | number
    status?: Enumtransaction_statusFilter<"ItemTransaction"> | $Enums.transaction_status
    pickupDate?: DateTimeFilter<"ItemTransaction"> | Date | string
    returnDate?: DateTimeNullableFilter<"ItemTransaction"> | Date | string | null
    requestNote?: StringNullableFilter<"ItemTransaction"> | string | null
    createdAt?: DateTimeFilter<"ItemTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"ItemTransaction"> | Date | string
    itemStack?: XOR<ItemStackScalarRelationFilter, ItemStackWhereInput>
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    admin?: XOR<AccountNullableScalarRelationFilter, AccountWhereInput> | null
  }, "id">

  export type ItemTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    itemStackId?: SortOrder
    accountId?: SortOrder
    adminId?: SortOrderInput | SortOrder
    quantity?: SortOrder
    status?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrderInput | SortOrder
    requestNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItemTransactionCountOrderByAggregateInput
    _avg?: ItemTransactionAvgOrderByAggregateInput
    _max?: ItemTransactionMaxOrderByAggregateInput
    _min?: ItemTransactionMinOrderByAggregateInput
    _sum?: ItemTransactionSumOrderByAggregateInput
  }

  export type ItemTransactionScalarWhereWithAggregatesInput = {
    AND?: ItemTransactionScalarWhereWithAggregatesInput | ItemTransactionScalarWhereWithAggregatesInput[]
    OR?: ItemTransactionScalarWhereWithAggregatesInput[]
    NOT?: ItemTransactionScalarWhereWithAggregatesInput | ItemTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ItemTransaction"> | string
    itemStackId?: StringWithAggregatesFilter<"ItemTransaction"> | string
    accountId?: StringWithAggregatesFilter<"ItemTransaction"> | string
    adminId?: StringNullableWithAggregatesFilter<"ItemTransaction"> | string | null
    quantity?: IntWithAggregatesFilter<"ItemTransaction"> | number
    status?: Enumtransaction_statusWithAggregatesFilter<"ItemTransaction"> | $Enums.transaction_status
    pickupDate?: DateTimeWithAggregatesFilter<"ItemTransaction"> | Date | string
    returnDate?: DateTimeNullableWithAggregatesFilter<"ItemTransaction"> | Date | string | null
    requestNote?: StringNullableWithAggregatesFilter<"ItemTransaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ItemTransaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ItemTransaction"> | Date | string
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
    start_time?: StringFilter<"Seminar"> | string
    end_time?: StringFilter<"Seminar"> | string
    capacity?: IntFilter<"Seminar"> | number
    registration_deadline?: DateTimeFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusFilter<"Seminar"> | $Enums.seminar_status
    picture?: BytesNullableFilter<"Seminar"> | Uint8Array | null
    mimeType?: StringNullableFilter<"Seminar"> | string | null
    createdById?: StringFilter<"Seminar"> | string
    createdAt?: DateTimeFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeFilter<"Seminar"> | Date | string
    participants?: SeminarParticipantListRelationFilter
    creator?: XOR<AccountScalarRelationFilter, AccountWhereInput>
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
    picture?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participants?: SeminarParticipantOrderByRelationAggregateInput
    creator?: AccountOrderByWithRelationInput
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
    start_time?: StringFilter<"Seminar"> | string
    end_time?: StringFilter<"Seminar"> | string
    capacity?: IntFilter<"Seminar"> | number
    registration_deadline?: DateTimeFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusFilter<"Seminar"> | $Enums.seminar_status
    picture?: BytesNullableFilter<"Seminar"> | Uint8Array | null
    mimeType?: StringNullableFilter<"Seminar"> | string | null
    createdById?: StringFilter<"Seminar"> | string
    createdAt?: DateTimeFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeFilter<"Seminar"> | Date | string
    participants?: SeminarParticipantListRelationFilter
    creator?: XOR<AccountScalarRelationFilter, AccountWhereInput>
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
    picture?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    createdById?: SortOrder
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
    start_time?: StringWithAggregatesFilter<"Seminar"> | string
    end_time?: StringWithAggregatesFilter<"Seminar"> | string
    capacity?: IntWithAggregatesFilter<"Seminar"> | number
    registration_deadline?: DateTimeWithAggregatesFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusWithAggregatesFilter<"Seminar"> | $Enums.seminar_status
    picture?: BytesNullableWithAggregatesFilter<"Seminar"> | Uint8Array | null
    mimeType?: StringNullableWithAggregatesFilter<"Seminar"> | string | null
    createdById?: StringWithAggregatesFilter<"Seminar"> | string
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type AuditLogCreateInput = {
    id?: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    admin: AccountCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    adminId: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: AccountUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    adminId: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateInput = {
    id?: string
    name: string
    description?: string | null
    picture?: Uint8Array | null
    category?: $Enums.item_category
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackCreateNestedManyWithoutItemInput
  }

  export type InventoryItemUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    picture?: Uint8Array | null
    category?: $Enums.item_category
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: ItemStackUncheckedCreateNestedManyWithoutItemInput
  }

  export type InventoryItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUpdateManyWithoutItemNestedInput
  }

  export type InventoryItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: ItemStackUncheckedUpdateManyWithoutItemNestedInput
  }

  export type InventoryItemCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    picture?: Uint8Array | null
    category?: $Enums.item_category
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackCreateInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item: InventoryItemCreateNestedOneWithoutItem_stacksInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutItemStackInput
  }

  export type ItemStackUncheckedCreateInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutItemStackInput
  }

  export type ItemStackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: InventoryItemUpdateOneRequiredWithoutItem_stacksNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutItemStackNestedInput
  }

  export type ItemStackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutItemStackNestedInput
  }

  export type ItemStackCreateManyInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemStackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionCreateInput = {
    id?: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemStack: ItemStackCreateNestedOneWithoutItemTransactionsInput
    account: AccountCreateNestedOneWithoutItemTransactionsInput
    admin?: AccountCreateNestedOneWithoutAdminTransactionsInput
  }

  export type ItemTransactionUncheckedCreateInput = {
    id?: string
    itemStackId: string
    accountId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemStack?: ItemStackUpdateOneRequiredWithoutItemTransactionsNestedInput
    account?: AccountUpdateOneRequiredWithoutItemTransactionsNestedInput
    admin?: AccountUpdateOneWithoutAdminTransactionsNestedInput
  }

  export type ItemTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionCreateManyInput = {
    id?: string
    itemStackId: string
    accountId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
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
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SeminarParticipantCreateNestedManyWithoutSeminarInput
    creator: AccountCreateNestedOneWithoutSeminarsCreatedInput
  }

  export type SeminarUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdById: string
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
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SeminarParticipantUpdateManyWithoutSeminarNestedInput
    creator?: AccountUpdateOneRequiredWithoutSeminarsCreatedNestedInput
  }

  export type SeminarUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
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
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdById: string
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
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
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
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
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

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
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

  export type ItemTransactionListRelationFilter = {
    every?: ItemTransactionWhereInput
    some?: ItemTransactionWhereInput
    none?: ItemTransactionWhereInput
  }

  export type SeminarListRelationFilter = {
    every?: SeminarWhereInput
    some?: SeminarWhereInput
    none?: SeminarWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
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

  export type ItemTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SeminarOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
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
    institution?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    mimeType?: SortOrder
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
    institution?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    mimeType?: SortOrder
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
    institution?: SortOrder
    address?: SortOrder
    picture?: SortOrder
    mimeType?: SortOrder
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

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
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

  export type Enumaudit_actionFilter<$PrismaModel = never> = {
    equals?: $Enums.audit_action | Enumaudit_actionFieldRefInput<$PrismaModel>
    in?: $Enums.audit_action[]
    notIn?: $Enums.audit_action[]
    not?: NestedEnumaudit_actionFilter<$PrismaModel> | $Enums.audit_action
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogOrderByRelevanceInput = {
    fields: AuditLogOrderByRelevanceFieldEnum | AuditLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    targetName?: SortOrder
    details?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    targetName?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    targetName?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type Enumaudit_actionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.audit_action | Enumaudit_actionFieldRefInput<$PrismaModel>
    in?: $Enums.audit_action[]
    notIn?: $Enums.audit_action[]
    not?: NestedEnumaudit_actionWithAggregatesFilter<$PrismaModel> | $Enums.audit_action
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaudit_actionFilter<$PrismaModel>
    _max?: NestedEnumaudit_actionFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type Enumitem_categoryFilter<$PrismaModel = never> = {
    equals?: $Enums.item_category | Enumitem_categoryFieldRefInput<$PrismaModel>
    in?: $Enums.item_category[]
    notIn?: $Enums.item_category[]
    not?: NestedEnumitem_categoryFilter<$PrismaModel> | $Enums.item_category
  }

  export type ItemStackListRelationFilter = {
    every?: ItemStackWhereInput
    some?: ItemStackWhereInput
    none?: ItemStackWhereInput
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
    picture?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    picture?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryItemMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    picture?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Enumitem_categoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.item_category | Enumitem_categoryFieldRefInput<$PrismaModel>
    in?: $Enums.item_category[]
    notIn?: $Enums.item_category[]
    not?: NestedEnumitem_categoryWithAggregatesFilter<$PrismaModel> | $Enums.item_category
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumitem_categoryFilter<$PrismaModel>
    _max?: NestedEnumitem_categoryFilter<$PrismaModel>
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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
    date_limit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackAvgOrderByAggregateInput = {
    quantity?: SortOrder
    date_limit?: SortOrder
  }

  export type ItemStackMaxOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    date_limit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackMinOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    date_limit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemStackSumOrderByAggregateInput = {
    quantity?: SortOrder
    date_limit?: SortOrder
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type Enumtransaction_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transaction_status | Enumtransaction_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transaction_status[]
    notIn?: $Enums.transaction_status[]
    not?: NestedEnumtransaction_statusFilter<$PrismaModel> | $Enums.transaction_status
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ItemStackScalarRelationFilter = {
    is?: ItemStackWhereInput
    isNot?: ItemStackWhereInput
  }

  export type AccountNullableScalarRelationFilter = {
    is?: AccountWhereInput | null
    isNot?: AccountWhereInput | null
  }

  export type ItemTransactionOrderByRelevanceInput = {
    fields: ItemTransactionOrderByRelevanceFieldEnum | ItemTransactionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ItemTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    itemStackId?: SortOrder
    accountId?: SortOrder
    adminId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    requestNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemTransactionAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ItemTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    itemStackId?: SortOrder
    accountId?: SortOrder
    adminId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    requestNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    itemStackId?: SortOrder
    accountId?: SortOrder
    adminId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    requestNote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemTransactionSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type Enumtransaction_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transaction_status | Enumtransaction_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transaction_status[]
    notIn?: $Enums.transaction_status[]
    not?: NestedEnumtransaction_statusWithAggregatesFilter<$PrismaModel> | $Enums.transaction_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransaction_statusFilter<$PrismaModel>
    _max?: NestedEnumtransaction_statusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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
    picture?: SortOrder
    mimeType?: SortOrder
    createdById?: SortOrder
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
    picture?: SortOrder
    mimeType?: SortOrder
    createdById?: SortOrder
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
    picture?: SortOrder
    mimeType?: SortOrder
    createdById?: SortOrder
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

  export type ItemTransactionCreateNestedManyWithoutAccountInput = {
    create?: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput> | ItemTransactionCreateWithoutAccountInput[] | ItemTransactionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAccountInput | ItemTransactionCreateOrConnectWithoutAccountInput[]
    createMany?: ItemTransactionCreateManyAccountInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
  }

  export type ItemTransactionCreateNestedManyWithoutAdminInput = {
    create?: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput> | ItemTransactionCreateWithoutAdminInput[] | ItemTransactionUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAdminInput | ItemTransactionCreateOrConnectWithoutAdminInput[]
    createMany?: ItemTransactionCreateManyAdminInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
  }

  export type SeminarCreateNestedManyWithoutCreatorInput = {
    create?: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput> | SeminarCreateWithoutCreatorInput[] | SeminarUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: SeminarCreateOrConnectWithoutCreatorInput | SeminarCreateOrConnectWithoutCreatorInput[]
    createMany?: SeminarCreateManyCreatorInputEnvelope
    connect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutAdminInput = {
    create?: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput> | AuditLogCreateWithoutAdminInput[] | AuditLogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutAdminInput | AuditLogCreateOrConnectWithoutAdminInput[]
    createMany?: AuditLogCreateManyAdminInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
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

  export type ItemTransactionUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput> | ItemTransactionCreateWithoutAccountInput[] | ItemTransactionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAccountInput | ItemTransactionCreateOrConnectWithoutAccountInput[]
    createMany?: ItemTransactionCreateManyAccountInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
  }

  export type ItemTransactionUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput> | ItemTransactionCreateWithoutAdminInput[] | ItemTransactionUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAdminInput | ItemTransactionCreateOrConnectWithoutAdminInput[]
    createMany?: ItemTransactionCreateManyAdminInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
  }

  export type SeminarUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput> | SeminarCreateWithoutCreatorInput[] | SeminarUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: SeminarCreateOrConnectWithoutCreatorInput | SeminarCreateOrConnectWithoutCreatorInput[]
    createMany?: SeminarCreateManyCreatorInputEnvelope
    connect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput> | AuditLogCreateWithoutAdminInput[] | AuditLogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutAdminInput | AuditLogCreateOrConnectWithoutAdminInput[]
    createMany?: AuditLogCreateManyAdminInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
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

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Uint8Array | null
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

  export type ItemTransactionUpdateManyWithoutAccountNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput> | ItemTransactionCreateWithoutAccountInput[] | ItemTransactionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAccountInput | ItemTransactionCreateOrConnectWithoutAccountInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutAccountInput | ItemTransactionUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: ItemTransactionCreateManyAccountInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutAccountInput | ItemTransactionUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutAccountInput | ItemTransactionUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type ItemTransactionUpdateManyWithoutAdminNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput> | ItemTransactionCreateWithoutAdminInput[] | ItemTransactionUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAdminInput | ItemTransactionCreateOrConnectWithoutAdminInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutAdminInput | ItemTransactionUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: ItemTransactionCreateManyAdminInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutAdminInput | ItemTransactionUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutAdminInput | ItemTransactionUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type SeminarUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput> | SeminarCreateWithoutCreatorInput[] | SeminarUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: SeminarCreateOrConnectWithoutCreatorInput | SeminarCreateOrConnectWithoutCreatorInput[]
    upsert?: SeminarUpsertWithWhereUniqueWithoutCreatorInput | SeminarUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: SeminarCreateManyCreatorInputEnvelope
    set?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    disconnect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    delete?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    connect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    update?: SeminarUpdateWithWhereUniqueWithoutCreatorInput | SeminarUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: SeminarUpdateManyWithWhereWithoutCreatorInput | SeminarUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: SeminarScalarWhereInput | SeminarScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutAdminNestedInput = {
    create?: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput> | AuditLogCreateWithoutAdminInput[] | AuditLogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutAdminInput | AuditLogCreateOrConnectWithoutAdminInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutAdminInput | AuditLogUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: AuditLogCreateManyAdminInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutAdminInput | AuditLogUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutAdminInput | AuditLogUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
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

  export type ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput> | ItemTransactionCreateWithoutAccountInput[] | ItemTransactionUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAccountInput | ItemTransactionCreateOrConnectWithoutAccountInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutAccountInput | ItemTransactionUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: ItemTransactionCreateManyAccountInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutAccountInput | ItemTransactionUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutAccountInput | ItemTransactionUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput> | ItemTransactionCreateWithoutAdminInput[] | ItemTransactionUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutAdminInput | ItemTransactionCreateOrConnectWithoutAdminInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutAdminInput | ItemTransactionUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: ItemTransactionCreateManyAdminInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutAdminInput | ItemTransactionUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutAdminInput | ItemTransactionUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type SeminarUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput> | SeminarCreateWithoutCreatorInput[] | SeminarUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: SeminarCreateOrConnectWithoutCreatorInput | SeminarCreateOrConnectWithoutCreatorInput[]
    upsert?: SeminarUpsertWithWhereUniqueWithoutCreatorInput | SeminarUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: SeminarCreateManyCreatorInputEnvelope
    set?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    disconnect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    delete?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    connect?: SeminarWhereUniqueInput | SeminarWhereUniqueInput[]
    update?: SeminarUpdateWithWhereUniqueWithoutCreatorInput | SeminarUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: SeminarUpdateManyWithWhereWithoutCreatorInput | SeminarUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: SeminarScalarWhereInput | SeminarScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput> | AuditLogCreateWithoutAdminInput[] | AuditLogUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutAdminInput | AuditLogCreateOrConnectWithoutAdminInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutAdminInput | AuditLogUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: AuditLogCreateManyAdminInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutAdminInput | AuditLogUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutAdminInput | AuditLogUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
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

  export type AccountCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<AccountCreateWithoutAuditLogsInput, AccountUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAuditLogsInput
    connect?: AccountWhereUniqueInput
  }

  export type Enumaudit_actionFieldUpdateOperationsInput = {
    set?: $Enums.audit_action
  }

  export type AccountUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<AccountCreateWithoutAuditLogsInput, AccountUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAuditLogsInput
    upsert?: AccountUpsertWithoutAuditLogsInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutAuditLogsInput, AccountUpdateWithoutAuditLogsInput>, AccountUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ItemStackCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
  }

  export type ItemStackUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput> | ItemStackCreateWithoutItemInput[] | ItemStackUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemInput | ItemStackCreateOrConnectWithoutItemInput[]
    createMany?: ItemStackCreateManyItemInputEnvelope
    connect?: ItemStackWhereUniqueInput | ItemStackWhereUniqueInput[]
  }

  export type Enumitem_categoryFieldUpdateOperationsInput = {
    set?: $Enums.item_category
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

  export type InventoryItemCreateNestedOneWithoutItem_stacksInput = {
    create?: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutItem_stacksInput
    connect?: InventoryItemWhereUniqueInput
  }

  export type ItemTransactionCreateNestedManyWithoutItemStackInput = {
    create?: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput> | ItemTransactionCreateWithoutItemStackInput[] | ItemTransactionUncheckedCreateWithoutItemStackInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutItemStackInput | ItemTransactionCreateOrConnectWithoutItemStackInput[]
    createMany?: ItemTransactionCreateManyItemStackInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
  }

  export type ItemTransactionUncheckedCreateNestedManyWithoutItemStackInput = {
    create?: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput> | ItemTransactionCreateWithoutItemStackInput[] | ItemTransactionUncheckedCreateWithoutItemStackInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutItemStackInput | ItemTransactionCreateOrConnectWithoutItemStackInput[]
    createMany?: ItemTransactionCreateManyItemStackInputEnvelope
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
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

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InventoryItemUpdateOneRequiredWithoutItem_stacksNestedInput = {
    create?: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutItem_stacksInput
    upsert?: InventoryItemUpsertWithoutItem_stacksInput
    connect?: InventoryItemWhereUniqueInput
    update?: XOR<XOR<InventoryItemUpdateToOneWithWhereWithoutItem_stacksInput, InventoryItemUpdateWithoutItem_stacksInput>, InventoryItemUncheckedUpdateWithoutItem_stacksInput>
  }

  export type ItemTransactionUpdateManyWithoutItemStackNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput> | ItemTransactionCreateWithoutItemStackInput[] | ItemTransactionUncheckedCreateWithoutItemStackInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutItemStackInput | ItemTransactionCreateOrConnectWithoutItemStackInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutItemStackInput | ItemTransactionUpsertWithWhereUniqueWithoutItemStackInput[]
    createMany?: ItemTransactionCreateManyItemStackInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutItemStackInput | ItemTransactionUpdateWithWhereUniqueWithoutItemStackInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutItemStackInput | ItemTransactionUpdateManyWithWhereWithoutItemStackInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type ItemTransactionUncheckedUpdateManyWithoutItemStackNestedInput = {
    create?: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput> | ItemTransactionCreateWithoutItemStackInput[] | ItemTransactionUncheckedCreateWithoutItemStackInput[]
    connectOrCreate?: ItemTransactionCreateOrConnectWithoutItemStackInput | ItemTransactionCreateOrConnectWithoutItemStackInput[]
    upsert?: ItemTransactionUpsertWithWhereUniqueWithoutItemStackInput | ItemTransactionUpsertWithWhereUniqueWithoutItemStackInput[]
    createMany?: ItemTransactionCreateManyItemStackInputEnvelope
    set?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    disconnect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    delete?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    connect?: ItemTransactionWhereUniqueInput | ItemTransactionWhereUniqueInput[]
    update?: ItemTransactionUpdateWithWhereUniqueWithoutItemStackInput | ItemTransactionUpdateWithWhereUniqueWithoutItemStackInput[]
    updateMany?: ItemTransactionUpdateManyWithWhereWithoutItemStackInput | ItemTransactionUpdateManyWithWhereWithoutItemStackInput[]
    deleteMany?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
  }

  export type ItemStackCreateNestedOneWithoutItemTransactionsInput = {
    create?: XOR<ItemStackCreateWithoutItemTransactionsInput, ItemStackUncheckedCreateWithoutItemTransactionsInput>
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemTransactionsInput
    connect?: ItemStackWhereUniqueInput
  }

  export type AccountCreateNestedOneWithoutItemTransactionsInput = {
    create?: XOR<AccountCreateWithoutItemTransactionsInput, AccountUncheckedCreateWithoutItemTransactionsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutItemTransactionsInput
    connect?: AccountWhereUniqueInput
  }

  export type AccountCreateNestedOneWithoutAdminTransactionsInput = {
    create?: XOR<AccountCreateWithoutAdminTransactionsInput, AccountUncheckedCreateWithoutAdminTransactionsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAdminTransactionsInput
    connect?: AccountWhereUniqueInput
  }

  export type Enumtransaction_statusFieldUpdateOperationsInput = {
    set?: $Enums.transaction_status
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ItemStackUpdateOneRequiredWithoutItemTransactionsNestedInput = {
    create?: XOR<ItemStackCreateWithoutItemTransactionsInput, ItemStackUncheckedCreateWithoutItemTransactionsInput>
    connectOrCreate?: ItemStackCreateOrConnectWithoutItemTransactionsInput
    upsert?: ItemStackUpsertWithoutItemTransactionsInput
    connect?: ItemStackWhereUniqueInput
    update?: XOR<XOR<ItemStackUpdateToOneWithWhereWithoutItemTransactionsInput, ItemStackUpdateWithoutItemTransactionsInput>, ItemStackUncheckedUpdateWithoutItemTransactionsInput>
  }

  export type AccountUpdateOneRequiredWithoutItemTransactionsNestedInput = {
    create?: XOR<AccountCreateWithoutItemTransactionsInput, AccountUncheckedCreateWithoutItemTransactionsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutItemTransactionsInput
    upsert?: AccountUpsertWithoutItemTransactionsInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutItemTransactionsInput, AccountUpdateWithoutItemTransactionsInput>, AccountUncheckedUpdateWithoutItemTransactionsInput>
  }

  export type AccountUpdateOneWithoutAdminTransactionsNestedInput = {
    create?: XOR<AccountCreateWithoutAdminTransactionsInput, AccountUncheckedCreateWithoutAdminTransactionsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutAdminTransactionsInput
    upsert?: AccountUpsertWithoutAdminTransactionsInput
    disconnect?: AccountWhereInput | boolean
    delete?: AccountWhereInput | boolean
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutAdminTransactionsInput, AccountUpdateWithoutAdminTransactionsInput>, AccountUncheckedUpdateWithoutAdminTransactionsInput>
  }

  export type SeminarParticipantCreateNestedManyWithoutSeminarInput = {
    create?: XOR<SeminarParticipantCreateWithoutSeminarInput, SeminarParticipantUncheckedCreateWithoutSeminarInput> | SeminarParticipantCreateWithoutSeminarInput[] | SeminarParticipantUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: SeminarParticipantCreateOrConnectWithoutSeminarInput | SeminarParticipantCreateOrConnectWithoutSeminarInput[]
    createMany?: SeminarParticipantCreateManySeminarInputEnvelope
    connect?: SeminarParticipantWhereUniqueInput | SeminarParticipantWhereUniqueInput[]
  }

  export type AccountCreateNestedOneWithoutSeminarsCreatedInput = {
    create?: XOR<AccountCreateWithoutSeminarsCreatedInput, AccountUncheckedCreateWithoutSeminarsCreatedInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSeminarsCreatedInput
    connect?: AccountWhereUniqueInput
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

  export type AccountUpdateOneRequiredWithoutSeminarsCreatedNestedInput = {
    create?: XOR<AccountCreateWithoutSeminarsCreatedInput, AccountUncheckedCreateWithoutSeminarsCreatedInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSeminarsCreatedInput
    upsert?: AccountUpsertWithoutSeminarsCreatedInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutSeminarsCreatedInput, AccountUpdateWithoutSeminarsCreatedInput>, AccountUncheckedUpdateWithoutSeminarsCreatedInput>
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

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
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

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
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

  export type NestedEnumaudit_actionFilter<$PrismaModel = never> = {
    equals?: $Enums.audit_action | Enumaudit_actionFieldRefInput<$PrismaModel>
    in?: $Enums.audit_action[]
    notIn?: $Enums.audit_action[]
    not?: NestedEnumaudit_actionFilter<$PrismaModel> | $Enums.audit_action
  }

  export type NestedEnumaudit_actionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.audit_action | Enumaudit_actionFieldRefInput<$PrismaModel>
    in?: $Enums.audit_action[]
    notIn?: $Enums.audit_action[]
    not?: NestedEnumaudit_actionWithAggregatesFilter<$PrismaModel> | $Enums.audit_action
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumaudit_actionFilter<$PrismaModel>
    _max?: NestedEnumaudit_actionFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumitem_categoryFilter<$PrismaModel = never> = {
    equals?: $Enums.item_category | Enumitem_categoryFieldRefInput<$PrismaModel>
    in?: $Enums.item_category[]
    notIn?: $Enums.item_category[]
    not?: NestedEnumitem_categoryFilter<$PrismaModel> | $Enums.item_category
  }

  export type NestedEnumitem_categoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.item_category | Enumitem_categoryFieldRefInput<$PrismaModel>
    in?: $Enums.item_category[]
    notIn?: $Enums.item_category[]
    not?: NestedEnumitem_categoryWithAggregatesFilter<$PrismaModel> | $Enums.item_category
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumitem_categoryFilter<$PrismaModel>
    _max?: NestedEnumitem_categoryFilter<$PrismaModel>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumtransaction_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.transaction_status | Enumtransaction_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transaction_status[]
    notIn?: $Enums.transaction_status[]
    not?: NestedEnumtransaction_statusFilter<$PrismaModel> | $Enums.transaction_status
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumtransaction_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transaction_status | Enumtransaction_statusFieldRefInput<$PrismaModel>
    in?: $Enums.transaction_status[]
    notIn?: $Enums.transaction_status[]
    not?: NestedEnumtransaction_statusWithAggregatesFilter<$PrismaModel> | $Enums.transaction_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtransaction_statusFilter<$PrismaModel>
    _max?: NestedEnumtransaction_statusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type ItemTransactionCreateWithoutAccountInput = {
    id?: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemStack: ItemStackCreateNestedOneWithoutItemTransactionsInput
    admin?: AccountCreateNestedOneWithoutAdminTransactionsInput
  }

  export type ItemTransactionUncheckedCreateWithoutAccountInput = {
    id?: string
    itemStackId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionCreateOrConnectWithoutAccountInput = {
    where: ItemTransactionWhereUniqueInput
    create: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput>
  }

  export type ItemTransactionCreateManyAccountInputEnvelope = {
    data: ItemTransactionCreateManyAccountInput | ItemTransactionCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type ItemTransactionCreateWithoutAdminInput = {
    id?: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemStack: ItemStackCreateNestedOneWithoutItemTransactionsInput
    account: AccountCreateNestedOneWithoutItemTransactionsInput
  }

  export type ItemTransactionUncheckedCreateWithoutAdminInput = {
    id?: string
    itemStackId: string
    accountId: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionCreateOrConnectWithoutAdminInput = {
    where: ItemTransactionWhereUniqueInput
    create: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput>
  }

  export type ItemTransactionCreateManyAdminInputEnvelope = {
    data: ItemTransactionCreateManyAdminInput | ItemTransactionCreateManyAdminInput[]
    skipDuplicates?: boolean
  }

  export type SeminarCreateWithoutCreatorInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SeminarParticipantCreateNestedManyWithoutSeminarInput
  }

  export type SeminarUncheckedCreateWithoutCreatorInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SeminarParticipantUncheckedCreateNestedManyWithoutSeminarInput
  }

  export type SeminarCreateOrConnectWithoutCreatorInput = {
    where: SeminarWhereUniqueInput
    create: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput>
  }

  export type SeminarCreateManyCreatorInputEnvelope = {
    data: SeminarCreateManyCreatorInput | SeminarCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutAdminInput = {
    id?: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutAdminInput = {
    id?: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutAdminInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput>
  }

  export type AuditLogCreateManyAdminInputEnvelope = {
    data: AuditLogCreateManyAdminInput | AuditLogCreateManyAdminInput[]
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

  export type ItemTransactionUpsertWithWhereUniqueWithoutAccountInput = {
    where: ItemTransactionWhereUniqueInput
    update: XOR<ItemTransactionUpdateWithoutAccountInput, ItemTransactionUncheckedUpdateWithoutAccountInput>
    create: XOR<ItemTransactionCreateWithoutAccountInput, ItemTransactionUncheckedCreateWithoutAccountInput>
  }

  export type ItemTransactionUpdateWithWhereUniqueWithoutAccountInput = {
    where: ItemTransactionWhereUniqueInput
    data: XOR<ItemTransactionUpdateWithoutAccountInput, ItemTransactionUncheckedUpdateWithoutAccountInput>
  }

  export type ItemTransactionUpdateManyWithWhereWithoutAccountInput = {
    where: ItemTransactionScalarWhereInput
    data: XOR<ItemTransactionUpdateManyMutationInput, ItemTransactionUncheckedUpdateManyWithoutAccountInput>
  }

  export type ItemTransactionScalarWhereInput = {
    AND?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
    OR?: ItemTransactionScalarWhereInput[]
    NOT?: ItemTransactionScalarWhereInput | ItemTransactionScalarWhereInput[]
    id?: StringFilter<"ItemTransaction"> | string
    itemStackId?: StringFilter<"ItemTransaction"> | string
    accountId?: StringFilter<"ItemTransaction"> | string
    adminId?: StringNullableFilter<"ItemTransaction"> | string | null
    quantity?: IntFilter<"ItemTransaction"> | number
    status?: Enumtransaction_statusFilter<"ItemTransaction"> | $Enums.transaction_status
    pickupDate?: DateTimeFilter<"ItemTransaction"> | Date | string
    returnDate?: DateTimeNullableFilter<"ItemTransaction"> | Date | string | null
    requestNote?: StringNullableFilter<"ItemTransaction"> | string | null
    createdAt?: DateTimeFilter<"ItemTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"ItemTransaction"> | Date | string
  }

  export type ItemTransactionUpsertWithWhereUniqueWithoutAdminInput = {
    where: ItemTransactionWhereUniqueInput
    update: XOR<ItemTransactionUpdateWithoutAdminInput, ItemTransactionUncheckedUpdateWithoutAdminInput>
    create: XOR<ItemTransactionCreateWithoutAdminInput, ItemTransactionUncheckedCreateWithoutAdminInput>
  }

  export type ItemTransactionUpdateWithWhereUniqueWithoutAdminInput = {
    where: ItemTransactionWhereUniqueInput
    data: XOR<ItemTransactionUpdateWithoutAdminInput, ItemTransactionUncheckedUpdateWithoutAdminInput>
  }

  export type ItemTransactionUpdateManyWithWhereWithoutAdminInput = {
    where: ItemTransactionScalarWhereInput
    data: XOR<ItemTransactionUpdateManyMutationInput, ItemTransactionUncheckedUpdateManyWithoutAdminInput>
  }

  export type SeminarUpsertWithWhereUniqueWithoutCreatorInput = {
    where: SeminarWhereUniqueInput
    update: XOR<SeminarUpdateWithoutCreatorInput, SeminarUncheckedUpdateWithoutCreatorInput>
    create: XOR<SeminarCreateWithoutCreatorInput, SeminarUncheckedCreateWithoutCreatorInput>
  }

  export type SeminarUpdateWithWhereUniqueWithoutCreatorInput = {
    where: SeminarWhereUniqueInput
    data: XOR<SeminarUpdateWithoutCreatorInput, SeminarUncheckedUpdateWithoutCreatorInput>
  }

  export type SeminarUpdateManyWithWhereWithoutCreatorInput = {
    where: SeminarScalarWhereInput
    data: XOR<SeminarUpdateManyMutationInput, SeminarUncheckedUpdateManyWithoutCreatorInput>
  }

  export type SeminarScalarWhereInput = {
    AND?: SeminarScalarWhereInput | SeminarScalarWhereInput[]
    OR?: SeminarScalarWhereInput[]
    NOT?: SeminarScalarWhereInput | SeminarScalarWhereInput[]
    id?: StringFilter<"Seminar"> | string
    title?: StringFilter<"Seminar"> | string
    description?: StringFilter<"Seminar"> | string
    location?: StringFilter<"Seminar"> | string
    speaker?: StringFilter<"Seminar"> | string
    start_date?: DateTimeFilter<"Seminar"> | Date | string
    end_date?: DateTimeFilter<"Seminar"> | Date | string
    start_time?: StringFilter<"Seminar"> | string
    end_time?: StringFilter<"Seminar"> | string
    capacity?: IntFilter<"Seminar"> | number
    registration_deadline?: DateTimeFilter<"Seminar"> | Date | string
    status?: Enumseminar_statusFilter<"Seminar"> | $Enums.seminar_status
    picture?: BytesNullableFilter<"Seminar"> | Uint8Array | null
    mimeType?: StringNullableFilter<"Seminar"> | string | null
    createdById?: StringFilter<"Seminar"> | string
    createdAt?: DateTimeFilter<"Seminar"> | Date | string
    updatedAt?: DateTimeFilter<"Seminar"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutAdminInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutAdminInput, AuditLogUncheckedUpdateWithoutAdminInput>
    create: XOR<AuditLogCreateWithoutAdminInput, AuditLogUncheckedCreateWithoutAdminInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutAdminInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutAdminInput, AuditLogUncheckedUpdateWithoutAdminInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutAdminInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutAdminInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    adminId?: StringFilter<"AuditLog"> | string
    action?: Enumaudit_actionFilter<"AuditLog"> | $Enums.audit_action
    targetType?: StringNullableFilter<"AuditLog"> | string | null
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    targetName?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AccountCreateWithoutAuditLogsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
  }

  export type AccountUncheckedCreateWithoutAuditLogsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type AccountCreateOrConnectWithoutAuditLogsInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutAuditLogsInput, AccountUncheckedCreateWithoutAuditLogsInput>
  }

  export type AccountUpsertWithoutAuditLogsInput = {
    update: XOR<AccountUpdateWithoutAuditLogsInput, AccountUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<AccountCreateWithoutAuditLogsInput, AccountUncheckedCreateWithoutAuditLogsInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutAuditLogsInput, AccountUncheckedUpdateWithoutAuditLogsInput>
  }

  export type AccountUpdateWithoutAuditLogsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
  }

  export type AccountUncheckedUpdateWithoutAuditLogsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ItemStackCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemTransactions?: ItemTransactionCreateNestedManyWithoutItemStackInput
  }

  export type ItemStackUncheckedCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutItemStackInput
  }

  export type ItemStackCreateOrConnectWithoutItemInput = {
    where: ItemStackWhereUniqueInput
    create: XOR<ItemStackCreateWithoutItemInput, ItemStackUncheckedCreateWithoutItemInput>
  }

  export type ItemStackCreateManyItemInputEnvelope = {
    data: ItemStackCreateManyItemInput | ItemStackCreateManyItemInput[]
    skipDuplicates?: boolean
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
    date_limit?: IntNullableFilter<"ItemStack"> | number | null
    createdAt?: DateTimeFilter<"ItemStack"> | Date | string
    updatedAt?: DateTimeFilter<"ItemStack"> | Date | string
  }

  export type InventoryItemCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    picture?: Uint8Array | null
    category?: $Enums.item_category
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemUncheckedCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    picture?: Uint8Array | null
    category?: $Enums.item_category
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryItemCreateOrConnectWithoutItem_stacksInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutItem_stacksInput, InventoryItemUncheckedCreateWithoutItem_stacksInput>
  }

  export type ItemTransactionCreateWithoutItemStackInput = {
    id?: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: AccountCreateNestedOneWithoutItemTransactionsInput
    admin?: AccountCreateNestedOneWithoutAdminTransactionsInput
  }

  export type ItemTransactionUncheckedCreateWithoutItemStackInput = {
    id?: string
    accountId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionCreateOrConnectWithoutItemStackInput = {
    where: ItemTransactionWhereUniqueInput
    create: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput>
  }

  export type ItemTransactionCreateManyItemStackInputEnvelope = {
    data: ItemTransactionCreateManyItemStackInput | ItemTransactionCreateManyItemStackInput[]
    skipDuplicates?: boolean
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
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUncheckedUpdateWithoutItem_stacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    category?: Enumitem_categoryFieldUpdateOperationsInput | $Enums.item_category
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUpsertWithWhereUniqueWithoutItemStackInput = {
    where: ItemTransactionWhereUniqueInput
    update: XOR<ItemTransactionUpdateWithoutItemStackInput, ItemTransactionUncheckedUpdateWithoutItemStackInput>
    create: XOR<ItemTransactionCreateWithoutItemStackInput, ItemTransactionUncheckedCreateWithoutItemStackInput>
  }

  export type ItemTransactionUpdateWithWhereUniqueWithoutItemStackInput = {
    where: ItemTransactionWhereUniqueInput
    data: XOR<ItemTransactionUpdateWithoutItemStackInput, ItemTransactionUncheckedUpdateWithoutItemStackInput>
  }

  export type ItemTransactionUpdateManyWithWhereWithoutItemStackInput = {
    where: ItemTransactionScalarWhereInput
    data: XOR<ItemTransactionUpdateManyMutationInput, ItemTransactionUncheckedUpdateManyWithoutItemStackInput>
  }

  export type ItemStackCreateWithoutItemTransactionsInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item: InventoryItemCreateNestedOneWithoutItem_stacksInput
  }

  export type ItemStackUncheckedCreateWithoutItemTransactionsInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackCreateOrConnectWithoutItemTransactionsInput = {
    where: ItemStackWhereUniqueInput
    create: XOR<ItemStackCreateWithoutItemTransactionsInput, ItemStackUncheckedCreateWithoutItemTransactionsInput>
  }

  export type AccountCreateWithoutItemTransactionsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
  }

  export type AccountUncheckedCreateWithoutItemTransactionsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AccountCreateOrConnectWithoutItemTransactionsInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutItemTransactionsInput, AccountUncheckedCreateWithoutItemTransactionsInput>
  }

  export type AccountCreateWithoutAdminTransactionsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
  }

  export type AccountUncheckedCreateWithoutAdminTransactionsInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AccountCreateOrConnectWithoutAdminTransactionsInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutAdminTransactionsInput, AccountUncheckedCreateWithoutAdminTransactionsInput>
  }

  export type ItemStackUpsertWithoutItemTransactionsInput = {
    update: XOR<ItemStackUpdateWithoutItemTransactionsInput, ItemStackUncheckedUpdateWithoutItemTransactionsInput>
    create: XOR<ItemStackCreateWithoutItemTransactionsInput, ItemStackUncheckedCreateWithoutItemTransactionsInput>
    where?: ItemStackWhereInput
  }

  export type ItemStackUpdateToOneWithWhereWithoutItemTransactionsInput = {
    where?: ItemStackWhereInput
    data: XOR<ItemStackUpdateWithoutItemTransactionsInput, ItemStackUncheckedUpdateWithoutItemTransactionsInput>
  }

  export type ItemStackUpdateWithoutItemTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: InventoryItemUpdateOneRequiredWithoutItem_stacksNestedInput
  }

  export type ItemStackUncheckedUpdateWithoutItemTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpsertWithoutItemTransactionsInput = {
    update: XOR<AccountUpdateWithoutItemTransactionsInput, AccountUncheckedUpdateWithoutItemTransactionsInput>
    create: XOR<AccountCreateWithoutItemTransactionsInput, AccountUncheckedCreateWithoutItemTransactionsInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutItemTransactionsInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutItemTransactionsInput, AccountUncheckedUpdateWithoutItemTransactionsInput>
  }

  export type AccountUpdateWithoutItemTransactionsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
  }

  export type AccountUncheckedUpdateWithoutItemTransactionsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AccountUpsertWithoutAdminTransactionsInput = {
    update: XOR<AccountUpdateWithoutAdminTransactionsInput, AccountUncheckedUpdateWithoutAdminTransactionsInput>
    create: XOR<AccountCreateWithoutAdminTransactionsInput, AccountUncheckedCreateWithoutAdminTransactionsInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutAdminTransactionsInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutAdminTransactionsInput, AccountUncheckedUpdateWithoutAdminTransactionsInput>
  }

  export type AccountUpdateWithoutAdminTransactionsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
  }

  export type AccountUncheckedUpdateWithoutAdminTransactionsInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
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

  export type AccountCreateWithoutSeminarsCreatedInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
  }

  export type AccountUncheckedCreateWithoutSeminarsCreatedInput = {
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    seminars?: SeminarParticipantUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AccountCreateOrConnectWithoutSeminarsCreatedInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutSeminarsCreatedInput, AccountUncheckedCreateWithoutSeminarsCreatedInput>
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

  export type AccountUpsertWithoutSeminarsCreatedInput = {
    update: XOR<AccountUpdateWithoutSeminarsCreatedInput, AccountUncheckedUpdateWithoutSeminarsCreatedInput>
    create: XOR<AccountCreateWithoutSeminarsCreatedInput, AccountUncheckedCreateWithoutSeminarsCreatedInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutSeminarsCreatedInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutSeminarsCreatedInput, AccountUncheckedUpdateWithoutSeminarsCreatedInput>
  }

  export type AccountUpdateWithoutSeminarsCreatedInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
  }

  export type AccountUncheckedUpdateWithoutSeminarsCreatedInput = {
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: SeminarParticipantUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type SeminarCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    creator: AccountCreateNestedOneWithoutSeminarsCreatedInput
  }

  export type SeminarUncheckedCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdById: string
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogCreateNestedManyWithoutAdminInput
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
    institution?: string | null
    address?: string | null
    picture?: Uint8Array | null
    mimeType?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity?: AccountCommodityUncheckedCreateNestedManyWithoutAccountInput
    itemTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAccountInput
    adminTransactions?: ItemTransactionUncheckedCreateNestedManyWithoutAdminInput
    seminarsCreated?: SeminarUncheckedCreateNestedManyWithoutCreatorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutAdminInput
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
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: AccountUpdateOneRequiredWithoutSeminarsCreatedNestedInput
  }

  export type SeminarUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutAdminNestedInput
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
    institution?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: AccountCommodityUncheckedUpdateManyWithoutAccountNestedInput
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutAccountNestedInput
    adminTransactions?: ItemTransactionUncheckedUpdateManyWithoutAdminNestedInput
    seminarsCreated?: SeminarUncheckedUpdateManyWithoutCreatorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutAdminNestedInput
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

  export type ItemTransactionCreateManyAccountInput = {
    id?: string
    itemStackId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionCreateManyAdminInput = {
    id?: string
    itemStackId: string
    accountId: string
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeminarCreateManyCreatorInput = {
    id?: string
    title: string
    description: string
    location: string
    speaker: string
    start_date: Date | string
    end_date: Date | string
    start_time: string
    end_time: string
    capacity: number
    registration_deadline: Date | string
    status?: $Enums.seminar_status
    picture?: Uint8Array | null
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyAdminInput = {
    id?: string
    action: $Enums.audit_action
    targetType?: string | null
    targetId?: string | null
    targetName?: string | null
    details?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
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

  export type ItemTransactionUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemStack?: ItemStackUpdateOneRequiredWithoutItemTransactionsNestedInput
    admin?: AccountUpdateOneWithoutAdminTransactionsNestedInput
  }

  export type ItemTransactionUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemStack?: ItemStackUpdateOneRequiredWithoutItemTransactionsNestedInput
    account?: AccountUpdateOneRequiredWithoutItemTransactionsNestedInput
  }

  export type ItemTransactionUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUncheckedUpdateManyWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemStackId?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeminarUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SeminarParticipantUpdateManyWithoutSeminarNestedInput
  }

  export type SeminarUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SeminarParticipantUncheckedUpdateManyWithoutSeminarNestedInput
  }

  export type SeminarUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    start_time?: StringFieldUpdateOperationsInput | string
    end_time?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    registration_deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: Enumseminar_statusFieldUpdateOperationsInput | $Enums.seminar_status
    picture?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: Enumaudit_actionFieldUpdateOperationsInput | $Enums.audit_action
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetName?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    date_limit?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemStackUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemTransactions?: ItemTransactionUpdateManyWithoutItemStackNestedInput
  }

  export type ItemStackUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    itemTransactions?: ItemTransactionUncheckedUpdateManyWithoutItemStackNestedInput
  }

  export type ItemStackUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    date_limit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionCreateManyItemStackInput = {
    id?: string
    accountId: string
    adminId?: string | null
    quantity?: number
    status?: $Enums.transaction_status
    pickupDate: Date | string
    returnDate?: Date | string | null
    requestNote?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemTransactionUpdateWithoutItemStackInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: AccountUpdateOneRequiredWithoutItemTransactionsNestedInput
    admin?: AccountUpdateOneWithoutAdminTransactionsNestedInput
  }

  export type ItemTransactionUncheckedUpdateWithoutItemStackInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemTransactionUncheckedUpdateManyWithoutItemStackInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumtransaction_statusFieldUpdateOperationsInput | $Enums.transaction_status
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestNote?: NullableStringFieldUpdateOperationsInput | string | null
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