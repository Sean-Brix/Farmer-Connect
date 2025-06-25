
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
 * Model accounts
 * 
 */
export type accounts = $Result.DefaultSelection<Prisma.$accountsPayload>
/**
 * Model commodities
 * 
 */
export type commodities = $Result.DefaultSelection<Prisma.$commoditiesPayload>
/**
 * Model accounts_commodities
 * 
 */
export type accounts_commodities = $Result.DefaultSelection<Prisma.$accounts_commoditiesPayload>
/**
 * Model inventory_items
 * 
 */
export type inventory_items = $Result.DefaultSelection<Prisma.$inventory_itemsPayload>
/**
 * Model inventory_categories
 * 
 */
export type inventory_categories = $Result.DefaultSelection<Prisma.$inventory_categoriesPayload>
/**
 * Model item_stacks
 * 
 */
export type item_stacks = $Result.DefaultSelection<Prisma.$item_stacksPayload>
/**
 * Model seminars
 * 
 */
export type seminars = $Result.DefaultSelection<Prisma.$seminarsPayload>
/**
 * Model seminar_participants
 * 
 */
export type seminar_participants = $Result.DefaultSelection<Prisma.$seminar_participantsPayload>

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
 * const accounts = await prisma.accounts.findMany()
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
   * const accounts = await prisma.accounts.findMany()
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
   * `prisma.accounts`: Exposes CRUD operations for the **accounts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.accounts.findMany()
    * ```
    */
  get accounts(): Prisma.accountsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.commodities`: Exposes CRUD operations for the **commodities** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Commodities
    * const commodities = await prisma.commodities.findMany()
    * ```
    */
  get commodities(): Prisma.commoditiesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accounts_commodities`: Exposes CRUD operations for the **accounts_commodities** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts_commodities
    * const accounts_commodities = await prisma.accounts_commodities.findMany()
    * ```
    */
  get accounts_commodities(): Prisma.accounts_commoditiesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventory_items`: Exposes CRUD operations for the **inventory_items** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventory_items
    * const inventory_items = await prisma.inventory_items.findMany()
    * ```
    */
  get inventory_items(): Prisma.inventory_itemsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventory_categories`: Exposes CRUD operations for the **inventory_categories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventory_categories
    * const inventory_categories = await prisma.inventory_categories.findMany()
    * ```
    */
  get inventory_categories(): Prisma.inventory_categoriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.item_stacks`: Exposes CRUD operations for the **item_stacks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Item_stacks
    * const item_stacks = await prisma.item_stacks.findMany()
    * ```
    */
  get item_stacks(): Prisma.item_stacksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seminars`: Exposes CRUD operations for the **seminars** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Seminars
    * const seminars = await prisma.seminars.findMany()
    * ```
    */
  get seminars(): Prisma.seminarsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seminar_participants`: Exposes CRUD operations for the **seminar_participants** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Seminar_participants
    * const seminar_participants = await prisma.seminar_participants.findMany()
    * ```
    */
  get seminar_participants(): Prisma.seminar_participantsDelegate<ExtArgs, ClientOptions>;
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
    accounts: 'accounts',
    commodities: 'commodities',
    accounts_commodities: 'accounts_commodities',
    inventory_items: 'inventory_items',
    inventory_categories: 'inventory_categories',
    item_stacks: 'item_stacks',
    seminars: 'seminars',
    seminar_participants: 'seminar_participants'
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
      modelProps: "accounts" | "commodities" | "accounts_commodities" | "inventory_items" | "inventory_categories" | "item_stacks" | "seminars" | "seminar_participants"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      accounts: {
        payload: Prisma.$accountsPayload<ExtArgs>
        fields: Prisma.accountsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accountsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accountsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findFirst: {
            args: Prisma.accountsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accountsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findMany: {
            args: Prisma.accountsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          create: {
            args: Prisma.accountsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          createMany: {
            args: Prisma.accountsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.accountsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          update: {
            args: Prisma.accountsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          deleteMany: {
            args: Prisma.accountsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accountsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.accountsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          aggregate: {
            args: Prisma.AccountsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccounts>
          }
          groupBy: {
            args: Prisma.accountsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountsGroupByOutputType>[]
          }
          count: {
            args: Prisma.accountsCountArgs<ExtArgs>
            result: $Utils.Optional<AccountsCountAggregateOutputType> | number
          }
        }
      }
      commodities: {
        payload: Prisma.$commoditiesPayload<ExtArgs>
        fields: Prisma.commoditiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.commoditiesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.commoditiesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          findFirst: {
            args: Prisma.commoditiesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.commoditiesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          findMany: {
            args: Prisma.commoditiesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>[]
          }
          create: {
            args: Prisma.commoditiesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          createMany: {
            args: Prisma.commoditiesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.commoditiesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          update: {
            args: Prisma.commoditiesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          deleteMany: {
            args: Prisma.commoditiesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.commoditiesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.commoditiesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$commoditiesPayload>
          }
          aggregate: {
            args: Prisma.CommoditiesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommodities>
          }
          groupBy: {
            args: Prisma.commoditiesGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommoditiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.commoditiesCountArgs<ExtArgs>
            result: $Utils.Optional<CommoditiesCountAggregateOutputType> | number
          }
        }
      }
      accounts_commodities: {
        payload: Prisma.$accounts_commoditiesPayload<ExtArgs>
        fields: Prisma.accounts_commoditiesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accounts_commoditiesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accounts_commoditiesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          findFirst: {
            args: Prisma.accounts_commoditiesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accounts_commoditiesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          findMany: {
            args: Prisma.accounts_commoditiesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>[]
          }
          create: {
            args: Prisma.accounts_commoditiesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          createMany: {
            args: Prisma.accounts_commoditiesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.accounts_commoditiesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          update: {
            args: Prisma.accounts_commoditiesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          deleteMany: {
            args: Prisma.accounts_commoditiesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accounts_commoditiesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.accounts_commoditiesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accounts_commoditiesPayload>
          }
          aggregate: {
            args: Prisma.Accounts_commoditiesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccounts_commodities>
          }
          groupBy: {
            args: Prisma.accounts_commoditiesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Accounts_commoditiesGroupByOutputType>[]
          }
          count: {
            args: Prisma.accounts_commoditiesCountArgs<ExtArgs>
            result: $Utils.Optional<Accounts_commoditiesCountAggregateOutputType> | number
          }
        }
      }
      inventory_items: {
        payload: Prisma.$inventory_itemsPayload<ExtArgs>
        fields: Prisma.inventory_itemsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.inventory_itemsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.inventory_itemsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          findFirst: {
            args: Prisma.inventory_itemsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.inventory_itemsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          findMany: {
            args: Prisma.inventory_itemsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>[]
          }
          create: {
            args: Prisma.inventory_itemsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          createMany: {
            args: Prisma.inventory_itemsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.inventory_itemsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          update: {
            args: Prisma.inventory_itemsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          deleteMany: {
            args: Prisma.inventory_itemsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.inventory_itemsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.inventory_itemsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_itemsPayload>
          }
          aggregate: {
            args: Prisma.Inventory_itemsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory_items>
          }
          groupBy: {
            args: Prisma.inventory_itemsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Inventory_itemsGroupByOutputType>[]
          }
          count: {
            args: Prisma.inventory_itemsCountArgs<ExtArgs>
            result: $Utils.Optional<Inventory_itemsCountAggregateOutputType> | number
          }
        }
      }
      inventory_categories: {
        payload: Prisma.$inventory_categoriesPayload<ExtArgs>
        fields: Prisma.inventory_categoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.inventory_categoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.inventory_categoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          findFirst: {
            args: Prisma.inventory_categoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.inventory_categoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          findMany: {
            args: Prisma.inventory_categoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>[]
          }
          create: {
            args: Prisma.inventory_categoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          createMany: {
            args: Prisma.inventory_categoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.inventory_categoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          update: {
            args: Prisma.inventory_categoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          deleteMany: {
            args: Prisma.inventory_categoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.inventory_categoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.inventory_categoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$inventory_categoriesPayload>
          }
          aggregate: {
            args: Prisma.Inventory_categoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory_categories>
          }
          groupBy: {
            args: Prisma.inventory_categoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Inventory_categoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.inventory_categoriesCountArgs<ExtArgs>
            result: $Utils.Optional<Inventory_categoriesCountAggregateOutputType> | number
          }
        }
      }
      item_stacks: {
        payload: Prisma.$item_stacksPayload<ExtArgs>
        fields: Prisma.item_stacksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.item_stacksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.item_stacksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          findFirst: {
            args: Prisma.item_stacksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.item_stacksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          findMany: {
            args: Prisma.item_stacksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>[]
          }
          create: {
            args: Prisma.item_stacksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          createMany: {
            args: Prisma.item_stacksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.item_stacksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          update: {
            args: Prisma.item_stacksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          deleteMany: {
            args: Prisma.item_stacksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.item_stacksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.item_stacksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$item_stacksPayload>
          }
          aggregate: {
            args: Prisma.Item_stacksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItem_stacks>
          }
          groupBy: {
            args: Prisma.item_stacksGroupByArgs<ExtArgs>
            result: $Utils.Optional<Item_stacksGroupByOutputType>[]
          }
          count: {
            args: Prisma.item_stacksCountArgs<ExtArgs>
            result: $Utils.Optional<Item_stacksCountAggregateOutputType> | number
          }
        }
      }
      seminars: {
        payload: Prisma.$seminarsPayload<ExtArgs>
        fields: Prisma.seminarsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.seminarsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.seminarsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          findFirst: {
            args: Prisma.seminarsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.seminarsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          findMany: {
            args: Prisma.seminarsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>[]
          }
          create: {
            args: Prisma.seminarsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          createMany: {
            args: Prisma.seminarsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.seminarsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          update: {
            args: Prisma.seminarsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          deleteMany: {
            args: Prisma.seminarsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.seminarsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.seminarsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminarsPayload>
          }
          aggregate: {
            args: Prisma.SeminarsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeminars>
          }
          groupBy: {
            args: Prisma.seminarsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeminarsGroupByOutputType>[]
          }
          count: {
            args: Prisma.seminarsCountArgs<ExtArgs>
            result: $Utils.Optional<SeminarsCountAggregateOutputType> | number
          }
        }
      }
      seminar_participants: {
        payload: Prisma.$seminar_participantsPayload<ExtArgs>
        fields: Prisma.seminar_participantsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.seminar_participantsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.seminar_participantsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          findFirst: {
            args: Prisma.seminar_participantsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.seminar_participantsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          findMany: {
            args: Prisma.seminar_participantsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>[]
          }
          create: {
            args: Prisma.seminar_participantsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          createMany: {
            args: Prisma.seminar_participantsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.seminar_participantsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          update: {
            args: Prisma.seminar_participantsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          deleteMany: {
            args: Prisma.seminar_participantsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.seminar_participantsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.seminar_participantsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$seminar_participantsPayload>
          }
          aggregate: {
            args: Prisma.Seminar_participantsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeminar_participants>
          }
          groupBy: {
            args: Prisma.seminar_participantsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Seminar_participantsGroupByOutputType>[]
          }
          count: {
            args: Prisma.seminar_participantsCountArgs<ExtArgs>
            result: $Utils.Optional<Seminar_participantsCountAggregateOutputType> | number
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
    accounts?: accountsOmit
    commodities?: commoditiesOmit
    accounts_commodities?: accounts_commoditiesOmit
    inventory_items?: inventory_itemsOmit
    inventory_categories?: inventory_categoriesOmit
    item_stacks?: item_stacksOmit
    seminars?: seminarsOmit
    seminar_participants?: seminar_participantsOmit
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
   * Count Type AccountsCountOutputType
   */

  export type AccountsCountOutputType = {
    commodity: number
    seminars: number
  }

  export type AccountsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | AccountsCountOutputTypeCountCommodityArgs
    seminars?: boolean | AccountsCountOutputTypeCountSeminarsArgs
  }

  // Custom InputTypes
  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountsCountOutputType
     */
    select?: AccountsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountCommodityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accounts_commoditiesWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountSeminarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: seminar_participantsWhereInput
  }


  /**
   * Count Type CommoditiesCountOutputType
   */

  export type CommoditiesCountOutputType = {
    accounts: number
  }

  export type CommoditiesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | CommoditiesCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * CommoditiesCountOutputType without action
   */
  export type CommoditiesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommoditiesCountOutputType
     */
    select?: CommoditiesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommoditiesCountOutputType without action
   */
  export type CommoditiesCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accounts_commoditiesWhereInput
  }


  /**
   * Count Type Inventory_itemsCountOutputType
   */

  export type Inventory_itemsCountOutputType = {
    item_stacks: number
  }

  export type Inventory_itemsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item_stacks?: boolean | Inventory_itemsCountOutputTypeCountItem_stacksArgs
  }

  // Custom InputTypes
  /**
   * Inventory_itemsCountOutputType without action
   */
  export type Inventory_itemsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory_itemsCountOutputType
     */
    select?: Inventory_itemsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Inventory_itemsCountOutputType without action
   */
  export type Inventory_itemsCountOutputTypeCountItem_stacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: item_stacksWhereInput
  }


  /**
   * Count Type Inventory_categoriesCountOutputType
   */

  export type Inventory_categoriesCountOutputType = {
    items: number
  }

  export type Inventory_categoriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Inventory_categoriesCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * Inventory_categoriesCountOutputType without action
   */
  export type Inventory_categoriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory_categoriesCountOutputType
     */
    select?: Inventory_categoriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Inventory_categoriesCountOutputType without action
   */
  export type Inventory_categoriesCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventory_itemsWhereInput
  }


  /**
   * Count Type SeminarsCountOutputType
   */

  export type SeminarsCountOutputType = {
    participants: number
  }

  export type SeminarsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | SeminarsCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * SeminarsCountOutputType without action
   */
  export type SeminarsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeminarsCountOutputType
     */
    select?: SeminarsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SeminarsCountOutputType without action
   */
  export type SeminarsCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: seminar_participantsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model accounts
   */

  export type AggregateAccounts = {
    _count: AccountsCountAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  export type AccountsMinAggregateOutputType = {
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

  export type AccountsMaxAggregateOutputType = {
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

  export type AccountsCountAggregateOutputType = {
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


  export type AccountsMinAggregateInputType = {
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

  export type AccountsMaxAggregateInputType = {
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

  export type AccountsCountAggregateInputType = {
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

  export type AccountsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to aggregate.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    _count?: true | AccountsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountsMaxAggregateInputType
  }

  export type GetAccountsAggregateType<T extends AccountsAggregateArgs> = {
        [P in keyof T & keyof AggregateAccounts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccounts[P]>
      : GetScalarType<T[P], AggregateAccounts[P]>
  }




  export type accountsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountsWhereInput
    orderBy?: accountsOrderByWithAggregationInput | accountsOrderByWithAggregationInput[]
    by: AccountsScalarFieldEnum[] | AccountsScalarFieldEnum
    having?: accountsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountsCountAggregateInputType | true
    _min?: AccountsMinAggregateInputType
    _max?: AccountsMaxAggregateInputType
  }

  export type AccountsGroupByOutputType = {
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
    _count: AccountsCountAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  type GetAccountsGroupByPayload<T extends accountsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountsGroupByOutputType[P]>
            : GetScalarType<T[P], AccountsGroupByOutputType[P]>
        }
      >
    >


  export type accountsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    commodity?: boolean | accounts$commodityArgs<ExtArgs>
    seminars?: boolean | accounts$seminarsArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accounts"]>



  export type accountsSelectScalar = {
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

  export type accountsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "access" | "username" | "email" | "firstName" | "lastName" | "middleName" | "gender" | "client_profile" | "cellphone_no" | "telephone_no" | "occupation" | "position" | "address" | "picture" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["accounts"]>
  export type accountsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | accounts$commodityArgs<ExtArgs>
    seminars?: boolean | accounts$seminarsArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts"
    objects: {
      commodity: Prisma.$accounts_commoditiesPayload<ExtArgs>[]
      seminars: Prisma.$seminar_participantsPayload<ExtArgs>[]
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
    }, ExtArgs["result"]["accounts"]>
    composites: {}
  }

  type accountsGetPayload<S extends boolean | null | undefined | accountsDefaultArgs> = $Result.GetResult<Prisma.$accountsPayload, S>

  type accountsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accountsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountsCountAggregateInputType | true
    }

  export interface accountsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accounts'], meta: { name: 'accounts' } }
    /**
     * Find zero or one Accounts that matches the filter.
     * @param {accountsFindUniqueArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accountsFindUniqueArgs>(args: SelectSubset<T, accountsFindUniqueArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accounts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accountsFindUniqueOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accountsFindUniqueOrThrowArgs>(args: SelectSubset<T, accountsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accountsFindFirstArgs>(args?: SelectSubset<T, accountsFindFirstArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accountsFindFirstOrThrowArgs>(args?: SelectSubset<T, accountsFindFirstOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.accounts.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.accounts.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountsWithIdOnly = await prisma.accounts.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accountsFindManyArgs>(args?: SelectSubset<T, accountsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accounts.
     * @param {accountsCreateArgs} args - Arguments to create a Accounts.
     * @example
     * // Create one Accounts
     * const Accounts = await prisma.accounts.create({
     *   data: {
     *     // ... data to create a Accounts
     *   }
     * })
     * 
     */
    create<T extends accountsCreateArgs>(args: SelectSubset<T, accountsCreateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {accountsCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const accounts = await prisma.accounts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accountsCreateManyArgs>(args?: SelectSubset<T, accountsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Accounts.
     * @param {accountsDeleteArgs} args - Arguments to delete one Accounts.
     * @example
     * // Delete one Accounts
     * const Accounts = await prisma.accounts.delete({
     *   where: {
     *     // ... filter to delete one Accounts
     *   }
     * })
     * 
     */
    delete<T extends accountsDeleteArgs>(args: SelectSubset<T, accountsDeleteArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accounts.
     * @param {accountsUpdateArgs} args - Arguments to update one Accounts.
     * @example
     * // Update one Accounts
     * const accounts = await prisma.accounts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accountsUpdateArgs>(args: SelectSubset<T, accountsUpdateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {accountsDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.accounts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accountsDeleteManyArgs>(args?: SelectSubset<T, accountsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const accounts = await prisma.accounts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accountsUpdateManyArgs>(args: SelectSubset<T, accountsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Accounts.
     * @param {accountsUpsertArgs} args - Arguments to update or create a Accounts.
     * @example
     * // Update or create a Accounts
     * const accounts = await prisma.accounts.upsert({
     *   create: {
     *     // ... data to create a Accounts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accounts we want to update
     *   }
     * })
     */
    upsert<T extends accountsUpsertArgs>(args: SelectSubset<T, accountsUpsertArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.accounts.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountsCountArgs>(
      args?: Subset<T, accountsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountsAggregateArgs>(args: Subset<T, AccountsAggregateArgs>): Prisma.PrismaPromise<GetAccountsAggregateType<T>>

    /**
     * Group by Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsGroupByArgs} args - Group by arguments.
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
      T extends accountsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accountsGroupByArgs['orderBy'] }
        : { orderBy?: accountsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, accountsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accounts model
   */
  readonly fields: accountsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accounts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accountsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends accounts$commodityArgs<ExtArgs> = {}>(args?: Subset<T, accounts$commodityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    seminars<T extends accounts$seminarsArgs<ExtArgs> = {}>(args?: Subset<T, accounts$seminarsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the accounts model
   */
  interface accountsFieldRefs {
    readonly id: FieldRef<"accounts", 'String'>
    readonly access: FieldRef<"accounts", 'access'>
    readonly username: FieldRef<"accounts", 'String'>
    readonly email: FieldRef<"accounts", 'String'>
    readonly firstName: FieldRef<"accounts", 'String'>
    readonly lastName: FieldRef<"accounts", 'String'>
    readonly middleName: FieldRef<"accounts", 'String'>
    readonly gender: FieldRef<"accounts", 'gender'>
    readonly client_profile: FieldRef<"accounts", 'client_profile'>
    readonly cellphone_no: FieldRef<"accounts", 'String'>
    readonly telephone_no: FieldRef<"accounts", 'String'>
    readonly occupation: FieldRef<"accounts", 'String'>
    readonly position: FieldRef<"accounts", 'String'>
    readonly address: FieldRef<"accounts", 'String'>
    readonly picture: FieldRef<"accounts", 'String'>
    readonly password: FieldRef<"accounts", 'String'>
    readonly createdAt: FieldRef<"accounts", 'DateTime'>
    readonly updatedAt: FieldRef<"accounts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * accounts findUnique
   */
  export type accountsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findUniqueOrThrow
   */
  export type accountsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findFirst
   */
  export type accountsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findFirstOrThrow
   */
  export type accountsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findMany
   */
  export type accountsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts create
   */
  export type accountsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to create a accounts.
     */
    data: XOR<accountsCreateInput, accountsUncheckedCreateInput>
  }

  /**
   * accounts createMany
   */
  export type accountsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts.
     */
    data: accountsCreateManyInput | accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts update
   */
  export type accountsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to update a accounts.
     */
    data: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
    /**
     * Choose, which accounts to update.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts updateMany
   */
  export type accountsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts.
     */
    data: XOR<accountsUpdateManyMutationInput, accountsUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * accounts upsert
   */
  export type accountsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The filter to search for the accounts to update in case it exists.
     */
    where: accountsWhereUniqueInput
    /**
     * In case the accounts found by the `where` argument doesn't exist, create a new accounts with this data.
     */
    create: XOR<accountsCreateInput, accountsUncheckedCreateInput>
    /**
     * In case the accounts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
  }

  /**
   * accounts delete
   */
  export type accountsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter which accounts to delete.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts deleteMany
   */
  export type accountsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to delete
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to delete.
     */
    limit?: number
  }

  /**
   * accounts.commodity
   */
  export type accounts$commodityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    where?: accounts_commoditiesWhereInput
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    cursor?: accounts_commoditiesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Accounts_commoditiesScalarFieldEnum | Accounts_commoditiesScalarFieldEnum[]
  }

  /**
   * accounts.seminars
   */
  export type accounts$seminarsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    where?: seminar_participantsWhereInput
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    cursor?: seminar_participantsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Seminar_participantsScalarFieldEnum | Seminar_participantsScalarFieldEnum[]
  }

  /**
   * accounts without action
   */
  export type accountsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
  }


  /**
   * Model commodities
   */

  export type AggregateCommodities = {
    _count: CommoditiesCountAggregateOutputType | null
    _min: CommoditiesMinAggregateOutputType | null
    _max: CommoditiesMaxAggregateOutputType | null
  }

  export type CommoditiesMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommoditiesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CommoditiesCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CommoditiesMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommoditiesMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CommoditiesCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CommoditiesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which commodities to aggregate.
     */
    where?: commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of commodities to fetch.
     */
    orderBy?: commoditiesOrderByWithRelationInput | commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned commodities
    **/
    _count?: true | CommoditiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommoditiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommoditiesMaxAggregateInputType
  }

  export type GetCommoditiesAggregateType<T extends CommoditiesAggregateArgs> = {
        [P in keyof T & keyof AggregateCommodities]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommodities[P]>
      : GetScalarType<T[P], AggregateCommodities[P]>
  }




  export type commoditiesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: commoditiesWhereInput
    orderBy?: commoditiesOrderByWithAggregationInput | commoditiesOrderByWithAggregationInput[]
    by: CommoditiesScalarFieldEnum[] | CommoditiesScalarFieldEnum
    having?: commoditiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommoditiesCountAggregateInputType | true
    _min?: CommoditiesMinAggregateInputType
    _max?: CommoditiesMaxAggregateInputType
  }

  export type CommoditiesGroupByOutputType = {
    id: string
    name: string
    icon: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: CommoditiesCountAggregateOutputType | null
    _min: CommoditiesMinAggregateOutputType | null
    _max: CommoditiesMaxAggregateOutputType | null
  }

  type GetCommoditiesGroupByPayload<T extends commoditiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommoditiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommoditiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommoditiesGroupByOutputType[P]>
            : GetScalarType<T[P], CommoditiesGroupByOutputType[P]>
        }
      >
    >


  export type commoditiesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | commodities$accountsArgs<ExtArgs>
    _count?: boolean | CommoditiesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["commodities"]>



  export type commoditiesSelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type commoditiesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["commodities"]>
  export type commoditiesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | commodities$accountsArgs<ExtArgs>
    _count?: boolean | CommoditiesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $commoditiesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "commodities"
    objects: {
      accounts: Prisma.$accounts_commoditiesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string | null
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["commodities"]>
    composites: {}
  }

  type commoditiesGetPayload<S extends boolean | null | undefined | commoditiesDefaultArgs> = $Result.GetResult<Prisma.$commoditiesPayload, S>

  type commoditiesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<commoditiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommoditiesCountAggregateInputType | true
    }

  export interface commoditiesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['commodities'], meta: { name: 'commodities' } }
    /**
     * Find zero or one Commodities that matches the filter.
     * @param {commoditiesFindUniqueArgs} args - Arguments to find a Commodities
     * @example
     * // Get one Commodities
     * const commodities = await prisma.commodities.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends commoditiesFindUniqueArgs>(args: SelectSubset<T, commoditiesFindUniqueArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Commodities that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {commoditiesFindUniqueOrThrowArgs} args - Arguments to find a Commodities
     * @example
     * // Get one Commodities
     * const commodities = await prisma.commodities.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends commoditiesFindUniqueOrThrowArgs>(args: SelectSubset<T, commoditiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesFindFirstArgs} args - Arguments to find a Commodities
     * @example
     * // Get one Commodities
     * const commodities = await prisma.commodities.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends commoditiesFindFirstArgs>(args?: SelectSubset<T, commoditiesFindFirstArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Commodities that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesFindFirstOrThrowArgs} args - Arguments to find a Commodities
     * @example
     * // Get one Commodities
     * const commodities = await prisma.commodities.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends commoditiesFindFirstOrThrowArgs>(args?: SelectSubset<T, commoditiesFindFirstOrThrowArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Commodities
     * const commodities = await prisma.commodities.findMany()
     * 
     * // Get first 10 Commodities
     * const commodities = await prisma.commodities.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commoditiesWithIdOnly = await prisma.commodities.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends commoditiesFindManyArgs>(args?: SelectSubset<T, commoditiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Commodities.
     * @param {commoditiesCreateArgs} args - Arguments to create a Commodities.
     * @example
     * // Create one Commodities
     * const Commodities = await prisma.commodities.create({
     *   data: {
     *     // ... data to create a Commodities
     *   }
     * })
     * 
     */
    create<T extends commoditiesCreateArgs>(args: SelectSubset<T, commoditiesCreateArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Commodities.
     * @param {commoditiesCreateManyArgs} args - Arguments to create many Commodities.
     * @example
     * // Create many Commodities
     * const commodities = await prisma.commodities.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends commoditiesCreateManyArgs>(args?: SelectSubset<T, commoditiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Commodities.
     * @param {commoditiesDeleteArgs} args - Arguments to delete one Commodities.
     * @example
     * // Delete one Commodities
     * const Commodities = await prisma.commodities.delete({
     *   where: {
     *     // ... filter to delete one Commodities
     *   }
     * })
     * 
     */
    delete<T extends commoditiesDeleteArgs>(args: SelectSubset<T, commoditiesDeleteArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Commodities.
     * @param {commoditiesUpdateArgs} args - Arguments to update one Commodities.
     * @example
     * // Update one Commodities
     * const commodities = await prisma.commodities.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends commoditiesUpdateArgs>(args: SelectSubset<T, commoditiesUpdateArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Commodities.
     * @param {commoditiesDeleteManyArgs} args - Arguments to filter Commodities to delete.
     * @example
     * // Delete a few Commodities
     * const { count } = await prisma.commodities.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends commoditiesDeleteManyArgs>(args?: SelectSubset<T, commoditiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Commodities
     * const commodities = await prisma.commodities.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends commoditiesUpdateManyArgs>(args: SelectSubset<T, commoditiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Commodities.
     * @param {commoditiesUpsertArgs} args - Arguments to update or create a Commodities.
     * @example
     * // Update or create a Commodities
     * const commodities = await prisma.commodities.upsert({
     *   create: {
     *     // ... data to create a Commodities
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Commodities we want to update
     *   }
     * })
     */
    upsert<T extends commoditiesUpsertArgs>(args: SelectSubset<T, commoditiesUpsertArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesCountArgs} args - Arguments to filter Commodities to count.
     * @example
     * // Count the number of Commodities
     * const count = await prisma.commodities.count({
     *   where: {
     *     // ... the filter for the Commodities we want to count
     *   }
     * })
    **/
    count<T extends commoditiesCountArgs>(
      args?: Subset<T, commoditiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommoditiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommoditiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommoditiesAggregateArgs>(args: Subset<T, CommoditiesAggregateArgs>): Prisma.PrismaPromise<GetCommoditiesAggregateType<T>>

    /**
     * Group by Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {commoditiesGroupByArgs} args - Group by arguments.
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
      T extends commoditiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: commoditiesGroupByArgs['orderBy'] }
        : { orderBy?: commoditiesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, commoditiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommoditiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the commodities model
   */
  readonly fields: commoditiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for commodities.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__commoditiesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends commodities$accountsArgs<ExtArgs> = {}>(args?: Subset<T, commodities$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the commodities model
   */
  interface commoditiesFieldRefs {
    readonly id: FieldRef<"commodities", 'String'>
    readonly name: FieldRef<"commodities", 'String'>
    readonly icon: FieldRef<"commodities", 'String'>
    readonly description: FieldRef<"commodities", 'String'>
    readonly createdAt: FieldRef<"commodities", 'DateTime'>
    readonly updatedAt: FieldRef<"commodities", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * commodities findUnique
   */
  export type commoditiesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which commodities to fetch.
     */
    where: commoditiesWhereUniqueInput
  }

  /**
   * commodities findUniqueOrThrow
   */
  export type commoditiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which commodities to fetch.
     */
    where: commoditiesWhereUniqueInput
  }

  /**
   * commodities findFirst
   */
  export type commoditiesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which commodities to fetch.
     */
    where?: commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of commodities to fetch.
     */
    orderBy?: commoditiesOrderByWithRelationInput | commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for commodities.
     */
    cursor?: commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of commodities.
     */
    distinct?: CommoditiesScalarFieldEnum | CommoditiesScalarFieldEnum[]
  }

  /**
   * commodities findFirstOrThrow
   */
  export type commoditiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which commodities to fetch.
     */
    where?: commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of commodities to fetch.
     */
    orderBy?: commoditiesOrderByWithRelationInput | commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for commodities.
     */
    cursor?: commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of commodities.
     */
    distinct?: CommoditiesScalarFieldEnum | CommoditiesScalarFieldEnum[]
  }

  /**
   * commodities findMany
   */
  export type commoditiesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which commodities to fetch.
     */
    where?: commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of commodities to fetch.
     */
    orderBy?: commoditiesOrderByWithRelationInput | commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing commodities.
     */
    cursor?: commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` commodities.
     */
    skip?: number
    distinct?: CommoditiesScalarFieldEnum | CommoditiesScalarFieldEnum[]
  }

  /**
   * commodities create
   */
  export type commoditiesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * The data needed to create a commodities.
     */
    data: XOR<commoditiesCreateInput, commoditiesUncheckedCreateInput>
  }

  /**
   * commodities createMany
   */
  export type commoditiesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many commodities.
     */
    data: commoditiesCreateManyInput | commoditiesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * commodities update
   */
  export type commoditiesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * The data needed to update a commodities.
     */
    data: XOR<commoditiesUpdateInput, commoditiesUncheckedUpdateInput>
    /**
     * Choose, which commodities to update.
     */
    where: commoditiesWhereUniqueInput
  }

  /**
   * commodities updateMany
   */
  export type commoditiesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update commodities.
     */
    data: XOR<commoditiesUpdateManyMutationInput, commoditiesUncheckedUpdateManyInput>
    /**
     * Filter which commodities to update
     */
    where?: commoditiesWhereInput
    /**
     * Limit how many commodities to update.
     */
    limit?: number
  }

  /**
   * commodities upsert
   */
  export type commoditiesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * The filter to search for the commodities to update in case it exists.
     */
    where: commoditiesWhereUniqueInput
    /**
     * In case the commodities found by the `where` argument doesn't exist, create a new commodities with this data.
     */
    create: XOR<commoditiesCreateInput, commoditiesUncheckedCreateInput>
    /**
     * In case the commodities was found with the provided `where` argument, update it with this data.
     */
    update: XOR<commoditiesUpdateInput, commoditiesUncheckedUpdateInput>
  }

  /**
   * commodities delete
   */
  export type commoditiesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
    /**
     * Filter which commodities to delete.
     */
    where: commoditiesWhereUniqueInput
  }

  /**
   * commodities deleteMany
   */
  export type commoditiesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which commodities to delete
     */
    where?: commoditiesWhereInput
    /**
     * Limit how many commodities to delete.
     */
    limit?: number
  }

  /**
   * commodities.accounts
   */
  export type commodities$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    where?: accounts_commoditiesWhereInput
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    cursor?: accounts_commoditiesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Accounts_commoditiesScalarFieldEnum | Accounts_commoditiesScalarFieldEnum[]
  }

  /**
   * commodities without action
   */
  export type commoditiesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the commodities
     */
    select?: commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the commodities
     */
    omit?: commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: commoditiesInclude<ExtArgs> | null
  }


  /**
   * Model accounts_commodities
   */

  export type AggregateAccounts_commodities = {
    _count: Accounts_commoditiesCountAggregateOutputType | null
    _min: Accounts_commoditiesMinAggregateOutputType | null
    _max: Accounts_commoditiesMaxAggregateOutputType | null
  }

  export type Accounts_commoditiesMinAggregateOutputType = {
    id: string | null
    account_id: string | null
    commodity_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Accounts_commoditiesMaxAggregateOutputType = {
    id: string | null
    account_id: string | null
    commodity_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Accounts_commoditiesCountAggregateOutputType = {
    id: number
    account_id: number
    commodity_id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Accounts_commoditiesMinAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Accounts_commoditiesMaxAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Accounts_commoditiesCountAggregateInputType = {
    id?: true
    account_id?: true
    commodity_id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Accounts_commoditiesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts_commodities to aggregate.
     */
    where?: accounts_commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts_commodities to fetch.
     */
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accounts_commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts_commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts_commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts_commodities
    **/
    _count?: true | Accounts_commoditiesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Accounts_commoditiesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Accounts_commoditiesMaxAggregateInputType
  }

  export type GetAccounts_commoditiesAggregateType<T extends Accounts_commoditiesAggregateArgs> = {
        [P in keyof T & keyof AggregateAccounts_commodities]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccounts_commodities[P]>
      : GetScalarType<T[P], AggregateAccounts_commodities[P]>
  }




  export type accounts_commoditiesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accounts_commoditiesWhereInput
    orderBy?: accounts_commoditiesOrderByWithAggregationInput | accounts_commoditiesOrderByWithAggregationInput[]
    by: Accounts_commoditiesScalarFieldEnum[] | Accounts_commoditiesScalarFieldEnum
    having?: accounts_commoditiesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Accounts_commoditiesCountAggregateInputType | true
    _min?: Accounts_commoditiesMinAggregateInputType
    _max?: Accounts_commoditiesMaxAggregateInputType
  }

  export type Accounts_commoditiesGroupByOutputType = {
    id: string
    account_id: string
    commodity_id: string
    createdAt: Date
    updatedAt: Date
    _count: Accounts_commoditiesCountAggregateOutputType | null
    _min: Accounts_commoditiesMinAggregateOutputType | null
    _max: Accounts_commoditiesMaxAggregateOutputType | null
  }

  type GetAccounts_commoditiesGroupByPayload<T extends accounts_commoditiesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Accounts_commoditiesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Accounts_commoditiesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Accounts_commoditiesGroupByOutputType[P]>
            : GetScalarType<T[P], Accounts_commoditiesGroupByOutputType[P]>
        }
      >
    >


  export type accounts_commoditiesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_id?: boolean
    commodity_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commodity?: boolean | commoditiesDefaultArgs<ExtArgs>
    account?: boolean | accountsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accounts_commodities"]>



  export type accounts_commoditiesSelectScalar = {
    id?: boolean
    account_id?: boolean
    commodity_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type accounts_commoditiesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_id" | "commodity_id" | "createdAt" | "updatedAt", ExtArgs["result"]["accounts_commodities"]>
  export type accounts_commoditiesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | commoditiesDefaultArgs<ExtArgs>
    account?: boolean | accountsDefaultArgs<ExtArgs>
  }

  export type $accounts_commoditiesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts_commodities"
    objects: {
      commodity: Prisma.$commoditiesPayload<ExtArgs>
      account: Prisma.$accountsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      account_id: string
      commodity_id: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accounts_commodities"]>
    composites: {}
  }

  type accounts_commoditiesGetPayload<S extends boolean | null | undefined | accounts_commoditiesDefaultArgs> = $Result.GetResult<Prisma.$accounts_commoditiesPayload, S>

  type accounts_commoditiesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accounts_commoditiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Accounts_commoditiesCountAggregateInputType | true
    }

  export interface accounts_commoditiesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accounts_commodities'], meta: { name: 'accounts_commodities' } }
    /**
     * Find zero or one Accounts_commodities that matches the filter.
     * @param {accounts_commoditiesFindUniqueArgs} args - Arguments to find a Accounts_commodities
     * @example
     * // Get one Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accounts_commoditiesFindUniqueArgs>(args: SelectSubset<T, accounts_commoditiesFindUniqueArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accounts_commodities that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accounts_commoditiesFindUniqueOrThrowArgs} args - Arguments to find a Accounts_commodities
     * @example
     * // Get one Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accounts_commoditiesFindUniqueOrThrowArgs>(args: SelectSubset<T, accounts_commoditiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts_commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesFindFirstArgs} args - Arguments to find a Accounts_commodities
     * @example
     * // Get one Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accounts_commoditiesFindFirstArgs>(args?: SelectSubset<T, accounts_commoditiesFindFirstArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts_commodities that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesFindFirstOrThrowArgs} args - Arguments to find a Accounts_commodities
     * @example
     * // Get one Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accounts_commoditiesFindFirstOrThrowArgs>(args?: SelectSubset<T, accounts_commoditiesFindFirstOrThrowArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts_commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findMany()
     * 
     * // Get first 10 Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accounts_commoditiesWithIdOnly = await prisma.accounts_commodities.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accounts_commoditiesFindManyArgs>(args?: SelectSubset<T, accounts_commoditiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accounts_commodities.
     * @param {accounts_commoditiesCreateArgs} args - Arguments to create a Accounts_commodities.
     * @example
     * // Create one Accounts_commodities
     * const Accounts_commodities = await prisma.accounts_commodities.create({
     *   data: {
     *     // ... data to create a Accounts_commodities
     *   }
     * })
     * 
     */
    create<T extends accounts_commoditiesCreateArgs>(args: SelectSubset<T, accounts_commoditiesCreateArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts_commodities.
     * @param {accounts_commoditiesCreateManyArgs} args - Arguments to create many Accounts_commodities.
     * @example
     * // Create many Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accounts_commoditiesCreateManyArgs>(args?: SelectSubset<T, accounts_commoditiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Accounts_commodities.
     * @param {accounts_commoditiesDeleteArgs} args - Arguments to delete one Accounts_commodities.
     * @example
     * // Delete one Accounts_commodities
     * const Accounts_commodities = await prisma.accounts_commodities.delete({
     *   where: {
     *     // ... filter to delete one Accounts_commodities
     *   }
     * })
     * 
     */
    delete<T extends accounts_commoditiesDeleteArgs>(args: SelectSubset<T, accounts_commoditiesDeleteArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accounts_commodities.
     * @param {accounts_commoditiesUpdateArgs} args - Arguments to update one Accounts_commodities.
     * @example
     * // Update one Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accounts_commoditiesUpdateArgs>(args: SelectSubset<T, accounts_commoditiesUpdateArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts_commodities.
     * @param {accounts_commoditiesDeleteManyArgs} args - Arguments to filter Accounts_commodities to delete.
     * @example
     * // Delete a few Accounts_commodities
     * const { count } = await prisma.accounts_commodities.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accounts_commoditiesDeleteManyArgs>(args?: SelectSubset<T, accounts_commoditiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts_commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accounts_commoditiesUpdateManyArgs>(args: SelectSubset<T, accounts_commoditiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Accounts_commodities.
     * @param {accounts_commoditiesUpsertArgs} args - Arguments to update or create a Accounts_commodities.
     * @example
     * // Update or create a Accounts_commodities
     * const accounts_commodities = await prisma.accounts_commodities.upsert({
     *   create: {
     *     // ... data to create a Accounts_commodities
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accounts_commodities we want to update
     *   }
     * })
     */
    upsert<T extends accounts_commoditiesUpsertArgs>(args: SelectSubset<T, accounts_commoditiesUpsertArgs<ExtArgs>>): Prisma__accounts_commoditiesClient<$Result.GetResult<Prisma.$accounts_commoditiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts_commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesCountArgs} args - Arguments to filter Accounts_commodities to count.
     * @example
     * // Count the number of Accounts_commodities
     * const count = await prisma.accounts_commodities.count({
     *   where: {
     *     // ... the filter for the Accounts_commodities we want to count
     *   }
     * })
    **/
    count<T extends accounts_commoditiesCountArgs>(
      args?: Subset<T, accounts_commoditiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Accounts_commoditiesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accounts_commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Accounts_commoditiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Accounts_commoditiesAggregateArgs>(args: Subset<T, Accounts_commoditiesAggregateArgs>): Prisma.PrismaPromise<GetAccounts_commoditiesAggregateType<T>>

    /**
     * Group by Accounts_commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accounts_commoditiesGroupByArgs} args - Group by arguments.
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
      T extends accounts_commoditiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accounts_commoditiesGroupByArgs['orderBy'] }
        : { orderBy?: accounts_commoditiesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, accounts_commoditiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccounts_commoditiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accounts_commodities model
   */
  readonly fields: accounts_commoditiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accounts_commodities.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accounts_commoditiesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends commoditiesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, commoditiesDefaultArgs<ExtArgs>>): Prisma__commoditiesClient<$Result.GetResult<Prisma.$commoditiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    account<T extends accountsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, accountsDefaultArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the accounts_commodities model
   */
  interface accounts_commoditiesFieldRefs {
    readonly id: FieldRef<"accounts_commodities", 'String'>
    readonly account_id: FieldRef<"accounts_commodities", 'String'>
    readonly commodity_id: FieldRef<"accounts_commodities", 'String'>
    readonly createdAt: FieldRef<"accounts_commodities", 'DateTime'>
    readonly updatedAt: FieldRef<"accounts_commodities", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * accounts_commodities findUnique
   */
  export type accounts_commoditiesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which accounts_commodities to fetch.
     */
    where: accounts_commoditiesWhereUniqueInput
  }

  /**
   * accounts_commodities findUniqueOrThrow
   */
  export type accounts_commoditiesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which accounts_commodities to fetch.
     */
    where: accounts_commoditiesWhereUniqueInput
  }

  /**
   * accounts_commodities findFirst
   */
  export type accounts_commoditiesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which accounts_commodities to fetch.
     */
    where?: accounts_commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts_commodities to fetch.
     */
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts_commodities.
     */
    cursor?: accounts_commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts_commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts_commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts_commodities.
     */
    distinct?: Accounts_commoditiesScalarFieldEnum | Accounts_commoditiesScalarFieldEnum[]
  }

  /**
   * accounts_commodities findFirstOrThrow
   */
  export type accounts_commoditiesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which accounts_commodities to fetch.
     */
    where?: accounts_commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts_commodities to fetch.
     */
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts_commodities.
     */
    cursor?: accounts_commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts_commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts_commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts_commodities.
     */
    distinct?: Accounts_commoditiesScalarFieldEnum | Accounts_commoditiesScalarFieldEnum[]
  }

  /**
   * accounts_commodities findMany
   */
  export type accounts_commoditiesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter, which accounts_commodities to fetch.
     */
    where?: accounts_commoditiesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts_commodities to fetch.
     */
    orderBy?: accounts_commoditiesOrderByWithRelationInput | accounts_commoditiesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts_commodities.
     */
    cursor?: accounts_commoditiesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts_commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts_commodities.
     */
    skip?: number
    distinct?: Accounts_commoditiesScalarFieldEnum | Accounts_commoditiesScalarFieldEnum[]
  }

  /**
   * accounts_commodities create
   */
  export type accounts_commoditiesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * The data needed to create a accounts_commodities.
     */
    data: XOR<accounts_commoditiesCreateInput, accounts_commoditiesUncheckedCreateInput>
  }

  /**
   * accounts_commodities createMany
   */
  export type accounts_commoditiesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts_commodities.
     */
    data: accounts_commoditiesCreateManyInput | accounts_commoditiesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts_commodities update
   */
  export type accounts_commoditiesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * The data needed to update a accounts_commodities.
     */
    data: XOR<accounts_commoditiesUpdateInput, accounts_commoditiesUncheckedUpdateInput>
    /**
     * Choose, which accounts_commodities to update.
     */
    where: accounts_commoditiesWhereUniqueInput
  }

  /**
   * accounts_commodities updateMany
   */
  export type accounts_commoditiesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts_commodities.
     */
    data: XOR<accounts_commoditiesUpdateManyMutationInput, accounts_commoditiesUncheckedUpdateManyInput>
    /**
     * Filter which accounts_commodities to update
     */
    where?: accounts_commoditiesWhereInput
    /**
     * Limit how many accounts_commodities to update.
     */
    limit?: number
  }

  /**
   * accounts_commodities upsert
   */
  export type accounts_commoditiesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * The filter to search for the accounts_commodities to update in case it exists.
     */
    where: accounts_commoditiesWhereUniqueInput
    /**
     * In case the accounts_commodities found by the `where` argument doesn't exist, create a new accounts_commodities with this data.
     */
    create: XOR<accounts_commoditiesCreateInput, accounts_commoditiesUncheckedCreateInput>
    /**
     * In case the accounts_commodities was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accounts_commoditiesUpdateInput, accounts_commoditiesUncheckedUpdateInput>
  }

  /**
   * accounts_commodities delete
   */
  export type accounts_commoditiesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
    /**
     * Filter which accounts_commodities to delete.
     */
    where: accounts_commoditiesWhereUniqueInput
  }

  /**
   * accounts_commodities deleteMany
   */
  export type accounts_commoditiesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts_commodities to delete
     */
    where?: accounts_commoditiesWhereInput
    /**
     * Limit how many accounts_commodities to delete.
     */
    limit?: number
  }

  /**
   * accounts_commodities without action
   */
  export type accounts_commoditiesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts_commodities
     */
    select?: accounts_commoditiesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts_commodities
     */
    omit?: accounts_commoditiesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accounts_commoditiesInclude<ExtArgs> | null
  }


  /**
   * Model inventory_items
   */

  export type AggregateInventory_items = {
    _count: Inventory_itemsCountAggregateOutputType | null
    _min: Inventory_itemsMinAggregateOutputType | null
    _max: Inventory_itemsMaxAggregateOutputType | null
  }

  export type Inventory_itemsMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Inventory_itemsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Inventory_itemsCountAggregateOutputType = {
    id: number
    name: number
    description: number
    categoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Inventory_itemsMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Inventory_itemsMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Inventory_itemsCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Inventory_itemsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventory_items to aggregate.
     */
    where?: inventory_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_items to fetch.
     */
    orderBy?: inventory_itemsOrderByWithRelationInput | inventory_itemsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: inventory_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned inventory_items
    **/
    _count?: true | Inventory_itemsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Inventory_itemsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Inventory_itemsMaxAggregateInputType
  }

  export type GetInventory_itemsAggregateType<T extends Inventory_itemsAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory_items]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory_items[P]>
      : GetScalarType<T[P], AggregateInventory_items[P]>
  }




  export type inventory_itemsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventory_itemsWhereInput
    orderBy?: inventory_itemsOrderByWithAggregationInput | inventory_itemsOrderByWithAggregationInput[]
    by: Inventory_itemsScalarFieldEnum[] | Inventory_itemsScalarFieldEnum
    having?: inventory_itemsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Inventory_itemsCountAggregateInputType | true
    _min?: Inventory_itemsMinAggregateInputType
    _max?: Inventory_itemsMaxAggregateInputType
  }

  export type Inventory_itemsGroupByOutputType = {
    id: string
    name: string
    description: string | null
    categoryId: string
    createdAt: Date
    updatedAt: Date
    _count: Inventory_itemsCountAggregateOutputType | null
    _min: Inventory_itemsMinAggregateOutputType | null
    _max: Inventory_itemsMaxAggregateOutputType | null
  }

  type GetInventory_itemsGroupByPayload<T extends inventory_itemsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Inventory_itemsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Inventory_itemsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Inventory_itemsGroupByOutputType[P]>
            : GetScalarType<T[P], Inventory_itemsGroupByOutputType[P]>
        }
      >
    >


  export type inventory_itemsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item_stacks?: boolean | inventory_items$item_stacksArgs<ExtArgs>
    category?: boolean | inventory_categoriesDefaultArgs<ExtArgs>
    _count?: boolean | Inventory_itemsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory_items"]>



  export type inventory_itemsSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type inventory_itemsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "categoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["inventory_items"]>
  export type inventory_itemsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item_stacks?: boolean | inventory_items$item_stacksArgs<ExtArgs>
    category?: boolean | inventory_categoriesDefaultArgs<ExtArgs>
    _count?: boolean | Inventory_itemsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $inventory_itemsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "inventory_items"
    objects: {
      item_stacks: Prisma.$item_stacksPayload<ExtArgs>[]
      category: Prisma.$inventory_categoriesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      categoryId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventory_items"]>
    composites: {}
  }

  type inventory_itemsGetPayload<S extends boolean | null | undefined | inventory_itemsDefaultArgs> = $Result.GetResult<Prisma.$inventory_itemsPayload, S>

  type inventory_itemsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<inventory_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Inventory_itemsCountAggregateInputType | true
    }

  export interface inventory_itemsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['inventory_items'], meta: { name: 'inventory_items' } }
    /**
     * Find zero or one Inventory_items that matches the filter.
     * @param {inventory_itemsFindUniqueArgs} args - Arguments to find a Inventory_items
     * @example
     * // Get one Inventory_items
     * const inventory_items = await prisma.inventory_items.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends inventory_itemsFindUniqueArgs>(args: SelectSubset<T, inventory_itemsFindUniqueArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory_items that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {inventory_itemsFindUniqueOrThrowArgs} args - Arguments to find a Inventory_items
     * @example
     * // Get one Inventory_items
     * const inventory_items = await prisma.inventory_items.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends inventory_itemsFindUniqueOrThrowArgs>(args: SelectSubset<T, inventory_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsFindFirstArgs} args - Arguments to find a Inventory_items
     * @example
     * // Get one Inventory_items
     * const inventory_items = await prisma.inventory_items.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends inventory_itemsFindFirstArgs>(args?: SelectSubset<T, inventory_itemsFindFirstArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory_items that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsFindFirstOrThrowArgs} args - Arguments to find a Inventory_items
     * @example
     * // Get one Inventory_items
     * const inventory_items = await prisma.inventory_items.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends inventory_itemsFindFirstOrThrowArgs>(args?: SelectSubset<T, inventory_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventory_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventory_items
     * const inventory_items = await prisma.inventory_items.findMany()
     * 
     * // Get first 10 Inventory_items
     * const inventory_items = await prisma.inventory_items.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventory_itemsWithIdOnly = await prisma.inventory_items.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends inventory_itemsFindManyArgs>(args?: SelectSubset<T, inventory_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory_items.
     * @param {inventory_itemsCreateArgs} args - Arguments to create a Inventory_items.
     * @example
     * // Create one Inventory_items
     * const Inventory_items = await prisma.inventory_items.create({
     *   data: {
     *     // ... data to create a Inventory_items
     *   }
     * })
     * 
     */
    create<T extends inventory_itemsCreateArgs>(args: SelectSubset<T, inventory_itemsCreateArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventory_items.
     * @param {inventory_itemsCreateManyArgs} args - Arguments to create many Inventory_items.
     * @example
     * // Create many Inventory_items
     * const inventory_items = await prisma.inventory_items.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends inventory_itemsCreateManyArgs>(args?: SelectSubset<T, inventory_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Inventory_items.
     * @param {inventory_itemsDeleteArgs} args - Arguments to delete one Inventory_items.
     * @example
     * // Delete one Inventory_items
     * const Inventory_items = await prisma.inventory_items.delete({
     *   where: {
     *     // ... filter to delete one Inventory_items
     *   }
     * })
     * 
     */
    delete<T extends inventory_itemsDeleteArgs>(args: SelectSubset<T, inventory_itemsDeleteArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory_items.
     * @param {inventory_itemsUpdateArgs} args - Arguments to update one Inventory_items.
     * @example
     * // Update one Inventory_items
     * const inventory_items = await prisma.inventory_items.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends inventory_itemsUpdateArgs>(args: SelectSubset<T, inventory_itemsUpdateArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventory_items.
     * @param {inventory_itemsDeleteManyArgs} args - Arguments to filter Inventory_items to delete.
     * @example
     * // Delete a few Inventory_items
     * const { count } = await prisma.inventory_items.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends inventory_itemsDeleteManyArgs>(args?: SelectSubset<T, inventory_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventory_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventory_items
     * const inventory_items = await prisma.inventory_items.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends inventory_itemsUpdateManyArgs>(args: SelectSubset<T, inventory_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inventory_items.
     * @param {inventory_itemsUpsertArgs} args - Arguments to update or create a Inventory_items.
     * @example
     * // Update or create a Inventory_items
     * const inventory_items = await prisma.inventory_items.upsert({
     *   create: {
     *     // ... data to create a Inventory_items
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory_items we want to update
     *   }
     * })
     */
    upsert<T extends inventory_itemsUpsertArgs>(args: SelectSubset<T, inventory_itemsUpsertArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventory_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsCountArgs} args - Arguments to filter Inventory_items to count.
     * @example
     * // Count the number of Inventory_items
     * const count = await prisma.inventory_items.count({
     *   where: {
     *     // ... the filter for the Inventory_items we want to count
     *   }
     * })
    **/
    count<T extends inventory_itemsCountArgs>(
      args?: Subset<T, inventory_itemsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Inventory_itemsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Inventory_itemsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Inventory_itemsAggregateArgs>(args: Subset<T, Inventory_itemsAggregateArgs>): Prisma.PrismaPromise<GetInventory_itemsAggregateType<T>>

    /**
     * Group by Inventory_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_itemsGroupByArgs} args - Group by arguments.
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
      T extends inventory_itemsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: inventory_itemsGroupByArgs['orderBy'] }
        : { orderBy?: inventory_itemsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, inventory_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventory_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the inventory_items model
   */
  readonly fields: inventory_itemsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for inventory_items.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__inventory_itemsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item_stacks<T extends inventory_items$item_stacksArgs<ExtArgs> = {}>(args?: Subset<T, inventory_items$item_stacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    category<T extends inventory_categoriesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, inventory_categoriesDefaultArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the inventory_items model
   */
  interface inventory_itemsFieldRefs {
    readonly id: FieldRef<"inventory_items", 'String'>
    readonly name: FieldRef<"inventory_items", 'String'>
    readonly description: FieldRef<"inventory_items", 'String'>
    readonly categoryId: FieldRef<"inventory_items", 'String'>
    readonly createdAt: FieldRef<"inventory_items", 'DateTime'>
    readonly updatedAt: FieldRef<"inventory_items", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * inventory_items findUnique
   */
  export type inventory_itemsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter, which inventory_items to fetch.
     */
    where: inventory_itemsWhereUniqueInput
  }

  /**
   * inventory_items findUniqueOrThrow
   */
  export type inventory_itemsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter, which inventory_items to fetch.
     */
    where: inventory_itemsWhereUniqueInput
  }

  /**
   * inventory_items findFirst
   */
  export type inventory_itemsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter, which inventory_items to fetch.
     */
    where?: inventory_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_items to fetch.
     */
    orderBy?: inventory_itemsOrderByWithRelationInput | inventory_itemsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventory_items.
     */
    cursor?: inventory_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventory_items.
     */
    distinct?: Inventory_itemsScalarFieldEnum | Inventory_itemsScalarFieldEnum[]
  }

  /**
   * inventory_items findFirstOrThrow
   */
  export type inventory_itemsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter, which inventory_items to fetch.
     */
    where?: inventory_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_items to fetch.
     */
    orderBy?: inventory_itemsOrderByWithRelationInput | inventory_itemsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventory_items.
     */
    cursor?: inventory_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventory_items.
     */
    distinct?: Inventory_itemsScalarFieldEnum | Inventory_itemsScalarFieldEnum[]
  }

  /**
   * inventory_items findMany
   */
  export type inventory_itemsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter, which inventory_items to fetch.
     */
    where?: inventory_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_items to fetch.
     */
    orderBy?: inventory_itemsOrderByWithRelationInput | inventory_itemsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing inventory_items.
     */
    cursor?: inventory_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_items.
     */
    skip?: number
    distinct?: Inventory_itemsScalarFieldEnum | Inventory_itemsScalarFieldEnum[]
  }

  /**
   * inventory_items create
   */
  export type inventory_itemsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * The data needed to create a inventory_items.
     */
    data: XOR<inventory_itemsCreateInput, inventory_itemsUncheckedCreateInput>
  }

  /**
   * inventory_items createMany
   */
  export type inventory_itemsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many inventory_items.
     */
    data: inventory_itemsCreateManyInput | inventory_itemsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * inventory_items update
   */
  export type inventory_itemsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * The data needed to update a inventory_items.
     */
    data: XOR<inventory_itemsUpdateInput, inventory_itemsUncheckedUpdateInput>
    /**
     * Choose, which inventory_items to update.
     */
    where: inventory_itemsWhereUniqueInput
  }

  /**
   * inventory_items updateMany
   */
  export type inventory_itemsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update inventory_items.
     */
    data: XOR<inventory_itemsUpdateManyMutationInput, inventory_itemsUncheckedUpdateManyInput>
    /**
     * Filter which inventory_items to update
     */
    where?: inventory_itemsWhereInput
    /**
     * Limit how many inventory_items to update.
     */
    limit?: number
  }

  /**
   * inventory_items upsert
   */
  export type inventory_itemsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * The filter to search for the inventory_items to update in case it exists.
     */
    where: inventory_itemsWhereUniqueInput
    /**
     * In case the inventory_items found by the `where` argument doesn't exist, create a new inventory_items with this data.
     */
    create: XOR<inventory_itemsCreateInput, inventory_itemsUncheckedCreateInput>
    /**
     * In case the inventory_items was found with the provided `where` argument, update it with this data.
     */
    update: XOR<inventory_itemsUpdateInput, inventory_itemsUncheckedUpdateInput>
  }

  /**
   * inventory_items delete
   */
  export type inventory_itemsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    /**
     * Filter which inventory_items to delete.
     */
    where: inventory_itemsWhereUniqueInput
  }

  /**
   * inventory_items deleteMany
   */
  export type inventory_itemsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventory_items to delete
     */
    where?: inventory_itemsWhereInput
    /**
     * Limit how many inventory_items to delete.
     */
    limit?: number
  }

  /**
   * inventory_items.item_stacks
   */
  export type inventory_items$item_stacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    where?: item_stacksWhereInput
    orderBy?: item_stacksOrderByWithRelationInput | item_stacksOrderByWithRelationInput[]
    cursor?: item_stacksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Item_stacksScalarFieldEnum | Item_stacksScalarFieldEnum[]
  }

  /**
   * inventory_items without action
   */
  export type inventory_itemsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
  }


  /**
   * Model inventory_categories
   */

  export type AggregateInventory_categories = {
    _count: Inventory_categoriesCountAggregateOutputType | null
    _min: Inventory_categoriesMinAggregateOutputType | null
    _max: Inventory_categoriesMaxAggregateOutputType | null
  }

  export type Inventory_categoriesMinAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Inventory_categoriesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    icon: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Inventory_categoriesCountAggregateOutputType = {
    id: number
    name: number
    icon: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Inventory_categoriesMinAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Inventory_categoriesMaxAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Inventory_categoriesCountAggregateInputType = {
    id?: true
    name?: true
    icon?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Inventory_categoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventory_categories to aggregate.
     */
    where?: inventory_categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_categories to fetch.
     */
    orderBy?: inventory_categoriesOrderByWithRelationInput | inventory_categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: inventory_categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned inventory_categories
    **/
    _count?: true | Inventory_categoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Inventory_categoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Inventory_categoriesMaxAggregateInputType
  }

  export type GetInventory_categoriesAggregateType<T extends Inventory_categoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory_categories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory_categories[P]>
      : GetScalarType<T[P], AggregateInventory_categories[P]>
  }




  export type inventory_categoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: inventory_categoriesWhereInput
    orderBy?: inventory_categoriesOrderByWithAggregationInput | inventory_categoriesOrderByWithAggregationInput[]
    by: Inventory_categoriesScalarFieldEnum[] | Inventory_categoriesScalarFieldEnum
    having?: inventory_categoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Inventory_categoriesCountAggregateInputType | true
    _min?: Inventory_categoriesMinAggregateInputType
    _max?: Inventory_categoriesMaxAggregateInputType
  }

  export type Inventory_categoriesGroupByOutputType = {
    id: string
    name: string
    icon: string | null
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: Inventory_categoriesCountAggregateOutputType | null
    _min: Inventory_categoriesMinAggregateOutputType | null
    _max: Inventory_categoriesMaxAggregateOutputType | null
  }

  type GetInventory_categoriesGroupByPayload<T extends inventory_categoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Inventory_categoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Inventory_categoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Inventory_categoriesGroupByOutputType[P]>
            : GetScalarType<T[P], Inventory_categoriesGroupByOutputType[P]>
        }
      >
    >


  export type inventory_categoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | inventory_categories$itemsArgs<ExtArgs>
    _count?: boolean | Inventory_categoriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory_categories"]>



  export type inventory_categoriesSelectScalar = {
    id?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type inventory_categoriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "icon" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["inventory_categories"]>
  export type inventory_categoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | inventory_categories$itemsArgs<ExtArgs>
    _count?: boolean | Inventory_categoriesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $inventory_categoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "inventory_categories"
    objects: {
      items: Prisma.$inventory_itemsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      icon: string | null
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventory_categories"]>
    composites: {}
  }

  type inventory_categoriesGetPayload<S extends boolean | null | undefined | inventory_categoriesDefaultArgs> = $Result.GetResult<Prisma.$inventory_categoriesPayload, S>

  type inventory_categoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<inventory_categoriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Inventory_categoriesCountAggregateInputType | true
    }

  export interface inventory_categoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['inventory_categories'], meta: { name: 'inventory_categories' } }
    /**
     * Find zero or one Inventory_categories that matches the filter.
     * @param {inventory_categoriesFindUniqueArgs} args - Arguments to find a Inventory_categories
     * @example
     * // Get one Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends inventory_categoriesFindUniqueArgs>(args: SelectSubset<T, inventory_categoriesFindUniqueArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory_categories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {inventory_categoriesFindUniqueOrThrowArgs} args - Arguments to find a Inventory_categories
     * @example
     * // Get one Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends inventory_categoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, inventory_categoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory_categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesFindFirstArgs} args - Arguments to find a Inventory_categories
     * @example
     * // Get one Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends inventory_categoriesFindFirstArgs>(args?: SelectSubset<T, inventory_categoriesFindFirstArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory_categories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesFindFirstOrThrowArgs} args - Arguments to find a Inventory_categories
     * @example
     * // Get one Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends inventory_categoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, inventory_categoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventory_categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findMany()
     * 
     * // Get first 10 Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventory_categoriesWithIdOnly = await prisma.inventory_categories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends inventory_categoriesFindManyArgs>(args?: SelectSubset<T, inventory_categoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory_categories.
     * @param {inventory_categoriesCreateArgs} args - Arguments to create a Inventory_categories.
     * @example
     * // Create one Inventory_categories
     * const Inventory_categories = await prisma.inventory_categories.create({
     *   data: {
     *     // ... data to create a Inventory_categories
     *   }
     * })
     * 
     */
    create<T extends inventory_categoriesCreateArgs>(args: SelectSubset<T, inventory_categoriesCreateArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventory_categories.
     * @param {inventory_categoriesCreateManyArgs} args - Arguments to create many Inventory_categories.
     * @example
     * // Create many Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends inventory_categoriesCreateManyArgs>(args?: SelectSubset<T, inventory_categoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Inventory_categories.
     * @param {inventory_categoriesDeleteArgs} args - Arguments to delete one Inventory_categories.
     * @example
     * // Delete one Inventory_categories
     * const Inventory_categories = await prisma.inventory_categories.delete({
     *   where: {
     *     // ... filter to delete one Inventory_categories
     *   }
     * })
     * 
     */
    delete<T extends inventory_categoriesDeleteArgs>(args: SelectSubset<T, inventory_categoriesDeleteArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory_categories.
     * @param {inventory_categoriesUpdateArgs} args - Arguments to update one Inventory_categories.
     * @example
     * // Update one Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends inventory_categoriesUpdateArgs>(args: SelectSubset<T, inventory_categoriesUpdateArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventory_categories.
     * @param {inventory_categoriesDeleteManyArgs} args - Arguments to filter Inventory_categories to delete.
     * @example
     * // Delete a few Inventory_categories
     * const { count } = await prisma.inventory_categories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends inventory_categoriesDeleteManyArgs>(args?: SelectSubset<T, inventory_categoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventory_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends inventory_categoriesUpdateManyArgs>(args: SelectSubset<T, inventory_categoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inventory_categories.
     * @param {inventory_categoriesUpsertArgs} args - Arguments to update or create a Inventory_categories.
     * @example
     * // Update or create a Inventory_categories
     * const inventory_categories = await prisma.inventory_categories.upsert({
     *   create: {
     *     // ... data to create a Inventory_categories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory_categories we want to update
     *   }
     * })
     */
    upsert<T extends inventory_categoriesUpsertArgs>(args: SelectSubset<T, inventory_categoriesUpsertArgs<ExtArgs>>): Prisma__inventory_categoriesClient<$Result.GetResult<Prisma.$inventory_categoriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventory_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesCountArgs} args - Arguments to filter Inventory_categories to count.
     * @example
     * // Count the number of Inventory_categories
     * const count = await prisma.inventory_categories.count({
     *   where: {
     *     // ... the filter for the Inventory_categories we want to count
     *   }
     * })
    **/
    count<T extends inventory_categoriesCountArgs>(
      args?: Subset<T, inventory_categoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Inventory_categoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Inventory_categoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Inventory_categoriesAggregateArgs>(args: Subset<T, Inventory_categoriesAggregateArgs>): Prisma.PrismaPromise<GetInventory_categoriesAggregateType<T>>

    /**
     * Group by Inventory_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {inventory_categoriesGroupByArgs} args - Group by arguments.
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
      T extends inventory_categoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: inventory_categoriesGroupByArgs['orderBy'] }
        : { orderBy?: inventory_categoriesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, inventory_categoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventory_categoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the inventory_categories model
   */
  readonly fields: inventory_categoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for inventory_categories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__inventory_categoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends inventory_categories$itemsArgs<ExtArgs> = {}>(args?: Subset<T, inventory_categories$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the inventory_categories model
   */
  interface inventory_categoriesFieldRefs {
    readonly id: FieldRef<"inventory_categories", 'String'>
    readonly name: FieldRef<"inventory_categories", 'String'>
    readonly icon: FieldRef<"inventory_categories", 'String'>
    readonly description: FieldRef<"inventory_categories", 'String'>
    readonly createdAt: FieldRef<"inventory_categories", 'DateTime'>
    readonly updatedAt: FieldRef<"inventory_categories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * inventory_categories findUnique
   */
  export type inventory_categoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter, which inventory_categories to fetch.
     */
    where: inventory_categoriesWhereUniqueInput
  }

  /**
   * inventory_categories findUniqueOrThrow
   */
  export type inventory_categoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter, which inventory_categories to fetch.
     */
    where: inventory_categoriesWhereUniqueInput
  }

  /**
   * inventory_categories findFirst
   */
  export type inventory_categoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter, which inventory_categories to fetch.
     */
    where?: inventory_categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_categories to fetch.
     */
    orderBy?: inventory_categoriesOrderByWithRelationInput | inventory_categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventory_categories.
     */
    cursor?: inventory_categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventory_categories.
     */
    distinct?: Inventory_categoriesScalarFieldEnum | Inventory_categoriesScalarFieldEnum[]
  }

  /**
   * inventory_categories findFirstOrThrow
   */
  export type inventory_categoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter, which inventory_categories to fetch.
     */
    where?: inventory_categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_categories to fetch.
     */
    orderBy?: inventory_categoriesOrderByWithRelationInput | inventory_categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for inventory_categories.
     */
    cursor?: inventory_categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of inventory_categories.
     */
    distinct?: Inventory_categoriesScalarFieldEnum | Inventory_categoriesScalarFieldEnum[]
  }

  /**
   * inventory_categories findMany
   */
  export type inventory_categoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter, which inventory_categories to fetch.
     */
    where?: inventory_categoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of inventory_categories to fetch.
     */
    orderBy?: inventory_categoriesOrderByWithRelationInput | inventory_categoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing inventory_categories.
     */
    cursor?: inventory_categoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` inventory_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` inventory_categories.
     */
    skip?: number
    distinct?: Inventory_categoriesScalarFieldEnum | Inventory_categoriesScalarFieldEnum[]
  }

  /**
   * inventory_categories create
   */
  export type inventory_categoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a inventory_categories.
     */
    data: XOR<inventory_categoriesCreateInput, inventory_categoriesUncheckedCreateInput>
  }

  /**
   * inventory_categories createMany
   */
  export type inventory_categoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many inventory_categories.
     */
    data: inventory_categoriesCreateManyInput | inventory_categoriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * inventory_categories update
   */
  export type inventory_categoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a inventory_categories.
     */
    data: XOR<inventory_categoriesUpdateInput, inventory_categoriesUncheckedUpdateInput>
    /**
     * Choose, which inventory_categories to update.
     */
    where: inventory_categoriesWhereUniqueInput
  }

  /**
   * inventory_categories updateMany
   */
  export type inventory_categoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update inventory_categories.
     */
    data: XOR<inventory_categoriesUpdateManyMutationInput, inventory_categoriesUncheckedUpdateManyInput>
    /**
     * Filter which inventory_categories to update
     */
    where?: inventory_categoriesWhereInput
    /**
     * Limit how many inventory_categories to update.
     */
    limit?: number
  }

  /**
   * inventory_categories upsert
   */
  export type inventory_categoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the inventory_categories to update in case it exists.
     */
    where: inventory_categoriesWhereUniqueInput
    /**
     * In case the inventory_categories found by the `where` argument doesn't exist, create a new inventory_categories with this data.
     */
    create: XOR<inventory_categoriesCreateInput, inventory_categoriesUncheckedCreateInput>
    /**
     * In case the inventory_categories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<inventory_categoriesUpdateInput, inventory_categoriesUncheckedUpdateInput>
  }

  /**
   * inventory_categories delete
   */
  export type inventory_categoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
    /**
     * Filter which inventory_categories to delete.
     */
    where: inventory_categoriesWhereUniqueInput
  }

  /**
   * inventory_categories deleteMany
   */
  export type inventory_categoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which inventory_categories to delete
     */
    where?: inventory_categoriesWhereInput
    /**
     * Limit how many inventory_categories to delete.
     */
    limit?: number
  }

  /**
   * inventory_categories.items
   */
  export type inventory_categories$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_items
     */
    select?: inventory_itemsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_items
     */
    omit?: inventory_itemsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_itemsInclude<ExtArgs> | null
    where?: inventory_itemsWhereInput
    orderBy?: inventory_itemsOrderByWithRelationInput | inventory_itemsOrderByWithRelationInput[]
    cursor?: inventory_itemsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Inventory_itemsScalarFieldEnum | Inventory_itemsScalarFieldEnum[]
  }

  /**
   * inventory_categories without action
   */
  export type inventory_categoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the inventory_categories
     */
    select?: inventory_categoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the inventory_categories
     */
    omit?: inventory_categoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: inventory_categoriesInclude<ExtArgs> | null
  }


  /**
   * Model item_stacks
   */

  export type AggregateItem_stacks = {
    _count: Item_stacksCountAggregateOutputType | null
    _avg: Item_stacksAvgAggregateOutputType | null
    _sum: Item_stacksSumAggregateOutputType | null
    _min: Item_stacksMinAggregateOutputType | null
    _max: Item_stacksMaxAggregateOutputType | null
  }

  export type Item_stacksAvgAggregateOutputType = {
    quantity: number | null
  }

  export type Item_stacksSumAggregateOutputType = {
    quantity: number | null
  }

  export type Item_stacksMinAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Item_stacksMaxAggregateOutputType = {
    id: string | null
    itemId: string | null
    quantity: number | null
    status: $Enums.item_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Item_stacksCountAggregateOutputType = {
    id: number
    itemId: number
    quantity: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Item_stacksAvgAggregateInputType = {
    quantity?: true
  }

  export type Item_stacksSumAggregateInputType = {
    quantity?: true
  }

  export type Item_stacksMinAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Item_stacksMaxAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Item_stacksCountAggregateInputType = {
    id?: true
    itemId?: true
    quantity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Item_stacksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which item_stacks to aggregate.
     */
    where?: item_stacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of item_stacks to fetch.
     */
    orderBy?: item_stacksOrderByWithRelationInput | item_stacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: item_stacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` item_stacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` item_stacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned item_stacks
    **/
    _count?: true | Item_stacksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Item_stacksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Item_stacksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Item_stacksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Item_stacksMaxAggregateInputType
  }

  export type GetItem_stacksAggregateType<T extends Item_stacksAggregateArgs> = {
        [P in keyof T & keyof AggregateItem_stacks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItem_stacks[P]>
      : GetScalarType<T[P], AggregateItem_stacks[P]>
  }




  export type item_stacksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: item_stacksWhereInput
    orderBy?: item_stacksOrderByWithAggregationInput | item_stacksOrderByWithAggregationInput[]
    by: Item_stacksScalarFieldEnum[] | Item_stacksScalarFieldEnum
    having?: item_stacksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Item_stacksCountAggregateInputType | true
    _avg?: Item_stacksAvgAggregateInputType
    _sum?: Item_stacksSumAggregateInputType
    _min?: Item_stacksMinAggregateInputType
    _max?: Item_stacksMaxAggregateInputType
  }

  export type Item_stacksGroupByOutputType = {
    id: string
    itemId: string
    quantity: number
    status: $Enums.item_status
    createdAt: Date
    updatedAt: Date
    _count: Item_stacksCountAggregateOutputType | null
    _avg: Item_stacksAvgAggregateOutputType | null
    _sum: Item_stacksSumAggregateOutputType | null
    _min: Item_stacksMinAggregateOutputType | null
    _max: Item_stacksMaxAggregateOutputType | null
  }

  type GetItem_stacksGroupByPayload<T extends item_stacksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Item_stacksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Item_stacksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Item_stacksGroupByOutputType[P]>
            : GetScalarType<T[P], Item_stacksGroupByOutputType[P]>
        }
      >
    >


  export type item_stacksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    item?: boolean | inventory_itemsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["item_stacks"]>



  export type item_stacksSelectScalar = {
    id?: boolean
    itemId?: boolean
    quantity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type item_stacksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemId" | "quantity" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["item_stacks"]>
  export type item_stacksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | inventory_itemsDefaultArgs<ExtArgs>
  }

  export type $item_stacksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "item_stacks"
    objects: {
      item: Prisma.$inventory_itemsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemId: string
      quantity: number
      status: $Enums.item_status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["item_stacks"]>
    composites: {}
  }

  type item_stacksGetPayload<S extends boolean | null | undefined | item_stacksDefaultArgs> = $Result.GetResult<Prisma.$item_stacksPayload, S>

  type item_stacksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<item_stacksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Item_stacksCountAggregateInputType | true
    }

  export interface item_stacksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['item_stacks'], meta: { name: 'item_stacks' } }
    /**
     * Find zero or one Item_stacks that matches the filter.
     * @param {item_stacksFindUniqueArgs} args - Arguments to find a Item_stacks
     * @example
     * // Get one Item_stacks
     * const item_stacks = await prisma.item_stacks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends item_stacksFindUniqueArgs>(args: SelectSubset<T, item_stacksFindUniqueArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Item_stacks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {item_stacksFindUniqueOrThrowArgs} args - Arguments to find a Item_stacks
     * @example
     * // Get one Item_stacks
     * const item_stacks = await prisma.item_stacks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends item_stacksFindUniqueOrThrowArgs>(args: SelectSubset<T, item_stacksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item_stacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksFindFirstArgs} args - Arguments to find a Item_stacks
     * @example
     * // Get one Item_stacks
     * const item_stacks = await prisma.item_stacks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends item_stacksFindFirstArgs>(args?: SelectSubset<T, item_stacksFindFirstArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Item_stacks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksFindFirstOrThrowArgs} args - Arguments to find a Item_stacks
     * @example
     * // Get one Item_stacks
     * const item_stacks = await prisma.item_stacks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends item_stacksFindFirstOrThrowArgs>(args?: SelectSubset<T, item_stacksFindFirstOrThrowArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Item_stacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Item_stacks
     * const item_stacks = await prisma.item_stacks.findMany()
     * 
     * // Get first 10 Item_stacks
     * const item_stacks = await prisma.item_stacks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const item_stacksWithIdOnly = await prisma.item_stacks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends item_stacksFindManyArgs>(args?: SelectSubset<T, item_stacksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Item_stacks.
     * @param {item_stacksCreateArgs} args - Arguments to create a Item_stacks.
     * @example
     * // Create one Item_stacks
     * const Item_stacks = await prisma.item_stacks.create({
     *   data: {
     *     // ... data to create a Item_stacks
     *   }
     * })
     * 
     */
    create<T extends item_stacksCreateArgs>(args: SelectSubset<T, item_stacksCreateArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Item_stacks.
     * @param {item_stacksCreateManyArgs} args - Arguments to create many Item_stacks.
     * @example
     * // Create many Item_stacks
     * const item_stacks = await prisma.item_stacks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends item_stacksCreateManyArgs>(args?: SelectSubset<T, item_stacksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Item_stacks.
     * @param {item_stacksDeleteArgs} args - Arguments to delete one Item_stacks.
     * @example
     * // Delete one Item_stacks
     * const Item_stacks = await prisma.item_stacks.delete({
     *   where: {
     *     // ... filter to delete one Item_stacks
     *   }
     * })
     * 
     */
    delete<T extends item_stacksDeleteArgs>(args: SelectSubset<T, item_stacksDeleteArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Item_stacks.
     * @param {item_stacksUpdateArgs} args - Arguments to update one Item_stacks.
     * @example
     * // Update one Item_stacks
     * const item_stacks = await prisma.item_stacks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends item_stacksUpdateArgs>(args: SelectSubset<T, item_stacksUpdateArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Item_stacks.
     * @param {item_stacksDeleteManyArgs} args - Arguments to filter Item_stacks to delete.
     * @example
     * // Delete a few Item_stacks
     * const { count } = await prisma.item_stacks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends item_stacksDeleteManyArgs>(args?: SelectSubset<T, item_stacksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Item_stacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Item_stacks
     * const item_stacks = await prisma.item_stacks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends item_stacksUpdateManyArgs>(args: SelectSubset<T, item_stacksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Item_stacks.
     * @param {item_stacksUpsertArgs} args - Arguments to update or create a Item_stacks.
     * @example
     * // Update or create a Item_stacks
     * const item_stacks = await prisma.item_stacks.upsert({
     *   create: {
     *     // ... data to create a Item_stacks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Item_stacks we want to update
     *   }
     * })
     */
    upsert<T extends item_stacksUpsertArgs>(args: SelectSubset<T, item_stacksUpsertArgs<ExtArgs>>): Prisma__item_stacksClient<$Result.GetResult<Prisma.$item_stacksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Item_stacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksCountArgs} args - Arguments to filter Item_stacks to count.
     * @example
     * // Count the number of Item_stacks
     * const count = await prisma.item_stacks.count({
     *   where: {
     *     // ... the filter for the Item_stacks we want to count
     *   }
     * })
    **/
    count<T extends item_stacksCountArgs>(
      args?: Subset<T, item_stacksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Item_stacksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Item_stacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Item_stacksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Item_stacksAggregateArgs>(args: Subset<T, Item_stacksAggregateArgs>): Prisma.PrismaPromise<GetItem_stacksAggregateType<T>>

    /**
     * Group by Item_stacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {item_stacksGroupByArgs} args - Group by arguments.
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
      T extends item_stacksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: item_stacksGroupByArgs['orderBy'] }
        : { orderBy?: item_stacksGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, item_stacksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItem_stacksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the item_stacks model
   */
  readonly fields: item_stacksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for item_stacks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__item_stacksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item<T extends inventory_itemsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, inventory_itemsDefaultArgs<ExtArgs>>): Prisma__inventory_itemsClient<$Result.GetResult<Prisma.$inventory_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the item_stacks model
   */
  interface item_stacksFieldRefs {
    readonly id: FieldRef<"item_stacks", 'String'>
    readonly itemId: FieldRef<"item_stacks", 'String'>
    readonly quantity: FieldRef<"item_stacks", 'Int'>
    readonly status: FieldRef<"item_stacks", 'item_status'>
    readonly createdAt: FieldRef<"item_stacks", 'DateTime'>
    readonly updatedAt: FieldRef<"item_stacks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * item_stacks findUnique
   */
  export type item_stacksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter, which item_stacks to fetch.
     */
    where: item_stacksWhereUniqueInput
  }

  /**
   * item_stacks findUniqueOrThrow
   */
  export type item_stacksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter, which item_stacks to fetch.
     */
    where: item_stacksWhereUniqueInput
  }

  /**
   * item_stacks findFirst
   */
  export type item_stacksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter, which item_stacks to fetch.
     */
    where?: item_stacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of item_stacks to fetch.
     */
    orderBy?: item_stacksOrderByWithRelationInput | item_stacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for item_stacks.
     */
    cursor?: item_stacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` item_stacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` item_stacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of item_stacks.
     */
    distinct?: Item_stacksScalarFieldEnum | Item_stacksScalarFieldEnum[]
  }

  /**
   * item_stacks findFirstOrThrow
   */
  export type item_stacksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter, which item_stacks to fetch.
     */
    where?: item_stacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of item_stacks to fetch.
     */
    orderBy?: item_stacksOrderByWithRelationInput | item_stacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for item_stacks.
     */
    cursor?: item_stacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` item_stacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` item_stacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of item_stacks.
     */
    distinct?: Item_stacksScalarFieldEnum | Item_stacksScalarFieldEnum[]
  }

  /**
   * item_stacks findMany
   */
  export type item_stacksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter, which item_stacks to fetch.
     */
    where?: item_stacksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of item_stacks to fetch.
     */
    orderBy?: item_stacksOrderByWithRelationInput | item_stacksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing item_stacks.
     */
    cursor?: item_stacksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` item_stacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` item_stacks.
     */
    skip?: number
    distinct?: Item_stacksScalarFieldEnum | Item_stacksScalarFieldEnum[]
  }

  /**
   * item_stacks create
   */
  export type item_stacksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * The data needed to create a item_stacks.
     */
    data: XOR<item_stacksCreateInput, item_stacksUncheckedCreateInput>
  }

  /**
   * item_stacks createMany
   */
  export type item_stacksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many item_stacks.
     */
    data: item_stacksCreateManyInput | item_stacksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * item_stacks update
   */
  export type item_stacksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * The data needed to update a item_stacks.
     */
    data: XOR<item_stacksUpdateInput, item_stacksUncheckedUpdateInput>
    /**
     * Choose, which item_stacks to update.
     */
    where: item_stacksWhereUniqueInput
  }

  /**
   * item_stacks updateMany
   */
  export type item_stacksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update item_stacks.
     */
    data: XOR<item_stacksUpdateManyMutationInput, item_stacksUncheckedUpdateManyInput>
    /**
     * Filter which item_stacks to update
     */
    where?: item_stacksWhereInput
    /**
     * Limit how many item_stacks to update.
     */
    limit?: number
  }

  /**
   * item_stacks upsert
   */
  export type item_stacksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * The filter to search for the item_stacks to update in case it exists.
     */
    where: item_stacksWhereUniqueInput
    /**
     * In case the item_stacks found by the `where` argument doesn't exist, create a new item_stacks with this data.
     */
    create: XOR<item_stacksCreateInput, item_stacksUncheckedCreateInput>
    /**
     * In case the item_stacks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<item_stacksUpdateInput, item_stacksUncheckedUpdateInput>
  }

  /**
   * item_stacks delete
   */
  export type item_stacksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
    /**
     * Filter which item_stacks to delete.
     */
    where: item_stacksWhereUniqueInput
  }

  /**
   * item_stacks deleteMany
   */
  export type item_stacksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which item_stacks to delete
     */
    where?: item_stacksWhereInput
    /**
     * Limit how many item_stacks to delete.
     */
    limit?: number
  }

  /**
   * item_stacks without action
   */
  export type item_stacksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the item_stacks
     */
    select?: item_stacksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the item_stacks
     */
    omit?: item_stacksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: item_stacksInclude<ExtArgs> | null
  }


  /**
   * Model seminars
   */

  export type AggregateSeminars = {
    _count: SeminarsCountAggregateOutputType | null
    _avg: SeminarsAvgAggregateOutputType | null
    _sum: SeminarsSumAggregateOutputType | null
    _min: SeminarsMinAggregateOutputType | null
    _max: SeminarsMaxAggregateOutputType | null
  }

  export type SeminarsAvgAggregateOutputType = {
    capacity: number | null
  }

  export type SeminarsSumAggregateOutputType = {
    capacity: number | null
  }

  export type SeminarsMinAggregateOutputType = {
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

  export type SeminarsMaxAggregateOutputType = {
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

  export type SeminarsCountAggregateOutputType = {
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


  export type SeminarsAvgAggregateInputType = {
    capacity?: true
  }

  export type SeminarsSumAggregateInputType = {
    capacity?: true
  }

  export type SeminarsMinAggregateInputType = {
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

  export type SeminarsMaxAggregateInputType = {
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

  export type SeminarsCountAggregateInputType = {
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

  export type SeminarsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which seminars to aggregate.
     */
    where?: seminarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminars to fetch.
     */
    orderBy?: seminarsOrderByWithRelationInput | seminarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: seminarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned seminars
    **/
    _count?: true | SeminarsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeminarsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeminarsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeminarsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeminarsMaxAggregateInputType
  }

  export type GetSeminarsAggregateType<T extends SeminarsAggregateArgs> = {
        [P in keyof T & keyof AggregateSeminars]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeminars[P]>
      : GetScalarType<T[P], AggregateSeminars[P]>
  }




  export type seminarsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: seminarsWhereInput
    orderBy?: seminarsOrderByWithAggregationInput | seminarsOrderByWithAggregationInput[]
    by: SeminarsScalarFieldEnum[] | SeminarsScalarFieldEnum
    having?: seminarsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeminarsCountAggregateInputType | true
    _avg?: SeminarsAvgAggregateInputType
    _sum?: SeminarsSumAggregateInputType
    _min?: SeminarsMinAggregateInputType
    _max?: SeminarsMaxAggregateInputType
  }

  export type SeminarsGroupByOutputType = {
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
    _count: SeminarsCountAggregateOutputType | null
    _avg: SeminarsAvgAggregateOutputType | null
    _sum: SeminarsSumAggregateOutputType | null
    _min: SeminarsMinAggregateOutputType | null
    _max: SeminarsMaxAggregateOutputType | null
  }

  type GetSeminarsGroupByPayload<T extends seminarsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeminarsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeminarsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeminarsGroupByOutputType[P]>
            : GetScalarType<T[P], SeminarsGroupByOutputType[P]>
        }
      >
    >


  export type seminarsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    participants?: boolean | seminars$participantsArgs<ExtArgs>
    _count?: boolean | SeminarsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seminars"]>



  export type seminarsSelectScalar = {
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

  export type seminarsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "location" | "speaker" | "start_date" | "end_date" | "start_time" | "end_time" | "capacity" | "registration_deadline" | "status" | "photo" | "createdAt" | "updatedAt", ExtArgs["result"]["seminars"]>
  export type seminarsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | seminars$participantsArgs<ExtArgs>
    _count?: boolean | SeminarsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $seminarsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "seminars"
    objects: {
      participants: Prisma.$seminar_participantsPayload<ExtArgs>[]
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
    }, ExtArgs["result"]["seminars"]>
    composites: {}
  }

  type seminarsGetPayload<S extends boolean | null | undefined | seminarsDefaultArgs> = $Result.GetResult<Prisma.$seminarsPayload, S>

  type seminarsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<seminarsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeminarsCountAggregateInputType | true
    }

  export interface seminarsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['seminars'], meta: { name: 'seminars' } }
    /**
     * Find zero or one Seminars that matches the filter.
     * @param {seminarsFindUniqueArgs} args - Arguments to find a Seminars
     * @example
     * // Get one Seminars
     * const seminars = await prisma.seminars.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends seminarsFindUniqueArgs>(args: SelectSubset<T, seminarsFindUniqueArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Seminars that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {seminarsFindUniqueOrThrowArgs} args - Arguments to find a Seminars
     * @example
     * // Get one Seminars
     * const seminars = await prisma.seminars.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends seminarsFindUniqueOrThrowArgs>(args: SelectSubset<T, seminarsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsFindFirstArgs} args - Arguments to find a Seminars
     * @example
     * // Get one Seminars
     * const seminars = await prisma.seminars.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends seminarsFindFirstArgs>(args?: SelectSubset<T, seminarsFindFirstArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminars that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsFindFirstOrThrowArgs} args - Arguments to find a Seminars
     * @example
     * // Get one Seminars
     * const seminars = await prisma.seminars.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends seminarsFindFirstOrThrowArgs>(args?: SelectSubset<T, seminarsFindFirstOrThrowArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Seminars that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Seminars
     * const seminars = await prisma.seminars.findMany()
     * 
     * // Get first 10 Seminars
     * const seminars = await prisma.seminars.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seminarsWithIdOnly = await prisma.seminars.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends seminarsFindManyArgs>(args?: SelectSubset<T, seminarsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Seminars.
     * @param {seminarsCreateArgs} args - Arguments to create a Seminars.
     * @example
     * // Create one Seminars
     * const Seminars = await prisma.seminars.create({
     *   data: {
     *     // ... data to create a Seminars
     *   }
     * })
     * 
     */
    create<T extends seminarsCreateArgs>(args: SelectSubset<T, seminarsCreateArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Seminars.
     * @param {seminarsCreateManyArgs} args - Arguments to create many Seminars.
     * @example
     * // Create many Seminars
     * const seminars = await prisma.seminars.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends seminarsCreateManyArgs>(args?: SelectSubset<T, seminarsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Seminars.
     * @param {seminarsDeleteArgs} args - Arguments to delete one Seminars.
     * @example
     * // Delete one Seminars
     * const Seminars = await prisma.seminars.delete({
     *   where: {
     *     // ... filter to delete one Seminars
     *   }
     * })
     * 
     */
    delete<T extends seminarsDeleteArgs>(args: SelectSubset<T, seminarsDeleteArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Seminars.
     * @param {seminarsUpdateArgs} args - Arguments to update one Seminars.
     * @example
     * // Update one Seminars
     * const seminars = await prisma.seminars.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends seminarsUpdateArgs>(args: SelectSubset<T, seminarsUpdateArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Seminars.
     * @param {seminarsDeleteManyArgs} args - Arguments to filter Seminars to delete.
     * @example
     * // Delete a few Seminars
     * const { count } = await prisma.seminars.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends seminarsDeleteManyArgs>(args?: SelectSubset<T, seminarsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Seminars
     * const seminars = await prisma.seminars.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends seminarsUpdateManyArgs>(args: SelectSubset<T, seminarsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Seminars.
     * @param {seminarsUpsertArgs} args - Arguments to update or create a Seminars.
     * @example
     * // Update or create a Seminars
     * const seminars = await prisma.seminars.upsert({
     *   create: {
     *     // ... data to create a Seminars
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Seminars we want to update
     *   }
     * })
     */
    upsert<T extends seminarsUpsertArgs>(args: SelectSubset<T, seminarsUpsertArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsCountArgs} args - Arguments to filter Seminars to count.
     * @example
     * // Count the number of Seminars
     * const count = await prisma.seminars.count({
     *   where: {
     *     // ... the filter for the Seminars we want to count
     *   }
     * })
    **/
    count<T extends seminarsCountArgs>(
      args?: Subset<T, seminarsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeminarsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeminarsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeminarsAggregateArgs>(args: Subset<T, SeminarsAggregateArgs>): Prisma.PrismaPromise<GetSeminarsAggregateType<T>>

    /**
     * Group by Seminars.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminarsGroupByArgs} args - Group by arguments.
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
      T extends seminarsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: seminarsGroupByArgs['orderBy'] }
        : { orderBy?: seminarsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, seminarsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeminarsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the seminars model
   */
  readonly fields: seminarsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for seminars.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__seminarsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends seminars$participantsArgs<ExtArgs> = {}>(args?: Subset<T, seminars$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the seminars model
   */
  interface seminarsFieldRefs {
    readonly id: FieldRef<"seminars", 'String'>
    readonly title: FieldRef<"seminars", 'String'>
    readonly description: FieldRef<"seminars", 'String'>
    readonly location: FieldRef<"seminars", 'String'>
    readonly speaker: FieldRef<"seminars", 'String'>
    readonly start_date: FieldRef<"seminars", 'DateTime'>
    readonly end_date: FieldRef<"seminars", 'DateTime'>
    readonly start_time: FieldRef<"seminars", 'DateTime'>
    readonly end_time: FieldRef<"seminars", 'DateTime'>
    readonly capacity: FieldRef<"seminars", 'Int'>
    readonly registration_deadline: FieldRef<"seminars", 'DateTime'>
    readonly status: FieldRef<"seminars", 'seminar_status'>
    readonly photo: FieldRef<"seminars", 'String'>
    readonly createdAt: FieldRef<"seminars", 'DateTime'>
    readonly updatedAt: FieldRef<"seminars", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * seminars findUnique
   */
  export type seminarsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter, which seminars to fetch.
     */
    where: seminarsWhereUniqueInput
  }

  /**
   * seminars findUniqueOrThrow
   */
  export type seminarsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter, which seminars to fetch.
     */
    where: seminarsWhereUniqueInput
  }

  /**
   * seminars findFirst
   */
  export type seminarsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter, which seminars to fetch.
     */
    where?: seminarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminars to fetch.
     */
    orderBy?: seminarsOrderByWithRelationInput | seminarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for seminars.
     */
    cursor?: seminarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of seminars.
     */
    distinct?: SeminarsScalarFieldEnum | SeminarsScalarFieldEnum[]
  }

  /**
   * seminars findFirstOrThrow
   */
  export type seminarsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter, which seminars to fetch.
     */
    where?: seminarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminars to fetch.
     */
    orderBy?: seminarsOrderByWithRelationInput | seminarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for seminars.
     */
    cursor?: seminarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminars.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of seminars.
     */
    distinct?: SeminarsScalarFieldEnum | SeminarsScalarFieldEnum[]
  }

  /**
   * seminars findMany
   */
  export type seminarsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter, which seminars to fetch.
     */
    where?: seminarsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminars to fetch.
     */
    orderBy?: seminarsOrderByWithRelationInput | seminarsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing seminars.
     */
    cursor?: seminarsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminars from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminars.
     */
    skip?: number
    distinct?: SeminarsScalarFieldEnum | SeminarsScalarFieldEnum[]
  }

  /**
   * seminars create
   */
  export type seminarsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * The data needed to create a seminars.
     */
    data: XOR<seminarsCreateInput, seminarsUncheckedCreateInput>
  }

  /**
   * seminars createMany
   */
  export type seminarsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many seminars.
     */
    data: seminarsCreateManyInput | seminarsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * seminars update
   */
  export type seminarsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * The data needed to update a seminars.
     */
    data: XOR<seminarsUpdateInput, seminarsUncheckedUpdateInput>
    /**
     * Choose, which seminars to update.
     */
    where: seminarsWhereUniqueInput
  }

  /**
   * seminars updateMany
   */
  export type seminarsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update seminars.
     */
    data: XOR<seminarsUpdateManyMutationInput, seminarsUncheckedUpdateManyInput>
    /**
     * Filter which seminars to update
     */
    where?: seminarsWhereInput
    /**
     * Limit how many seminars to update.
     */
    limit?: number
  }

  /**
   * seminars upsert
   */
  export type seminarsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * The filter to search for the seminars to update in case it exists.
     */
    where: seminarsWhereUniqueInput
    /**
     * In case the seminars found by the `where` argument doesn't exist, create a new seminars with this data.
     */
    create: XOR<seminarsCreateInput, seminarsUncheckedCreateInput>
    /**
     * In case the seminars was found with the provided `where` argument, update it with this data.
     */
    update: XOR<seminarsUpdateInput, seminarsUncheckedUpdateInput>
  }

  /**
   * seminars delete
   */
  export type seminarsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
    /**
     * Filter which seminars to delete.
     */
    where: seminarsWhereUniqueInput
  }

  /**
   * seminars deleteMany
   */
  export type seminarsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which seminars to delete
     */
    where?: seminarsWhereInput
    /**
     * Limit how many seminars to delete.
     */
    limit?: number
  }

  /**
   * seminars.participants
   */
  export type seminars$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    where?: seminar_participantsWhereInput
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    cursor?: seminar_participantsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Seminar_participantsScalarFieldEnum | Seminar_participantsScalarFieldEnum[]
  }

  /**
   * seminars without action
   */
  export type seminarsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminars
     */
    select?: seminarsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminars
     */
    omit?: seminarsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminarsInclude<ExtArgs> | null
  }


  /**
   * Model seminar_participants
   */

  export type AggregateSeminar_participants = {
    _count: Seminar_participantsCountAggregateOutputType | null
    _min: Seminar_participantsMinAggregateOutputType | null
    _max: Seminar_participantsMaxAggregateOutputType | null
  }

  export type Seminar_participantsMinAggregateOutputType = {
    id: string | null
    seminar_id: string | null
    account_id: string | null
    status: $Enums.participant_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Seminar_participantsMaxAggregateOutputType = {
    id: string | null
    seminar_id: string | null
    account_id: string | null
    status: $Enums.participant_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Seminar_participantsCountAggregateOutputType = {
    id: number
    seminar_id: number
    account_id: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Seminar_participantsMinAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Seminar_participantsMaxAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Seminar_participantsCountAggregateInputType = {
    id?: true
    seminar_id?: true
    account_id?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Seminar_participantsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which seminar_participants to aggregate.
     */
    where?: seminar_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminar_participants to fetch.
     */
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: seminar_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminar_participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminar_participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned seminar_participants
    **/
    _count?: true | Seminar_participantsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Seminar_participantsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Seminar_participantsMaxAggregateInputType
  }

  export type GetSeminar_participantsAggregateType<T extends Seminar_participantsAggregateArgs> = {
        [P in keyof T & keyof AggregateSeminar_participants]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeminar_participants[P]>
      : GetScalarType<T[P], AggregateSeminar_participants[P]>
  }




  export type seminar_participantsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: seminar_participantsWhereInput
    orderBy?: seminar_participantsOrderByWithAggregationInput | seminar_participantsOrderByWithAggregationInput[]
    by: Seminar_participantsScalarFieldEnum[] | Seminar_participantsScalarFieldEnum
    having?: seminar_participantsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Seminar_participantsCountAggregateInputType | true
    _min?: Seminar_participantsMinAggregateInputType
    _max?: Seminar_participantsMaxAggregateInputType
  }

  export type Seminar_participantsGroupByOutputType = {
    id: string
    seminar_id: string
    account_id: string
    status: $Enums.participant_status
    createdAt: Date
    updatedAt: Date
    _count: Seminar_participantsCountAggregateOutputType | null
    _min: Seminar_participantsMinAggregateOutputType | null
    _max: Seminar_participantsMaxAggregateOutputType | null
  }

  type GetSeminar_participantsGroupByPayload<T extends seminar_participantsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Seminar_participantsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Seminar_participantsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Seminar_participantsGroupByOutputType[P]>
            : GetScalarType<T[P], Seminar_participantsGroupByOutputType[P]>
        }
      >
    >


  export type seminar_participantsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seminar_id?: boolean
    account_id?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    seminar?: boolean | seminarsDefaultArgs<ExtArgs>
    account?: boolean | accountsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seminar_participants"]>



  export type seminar_participantsSelectScalar = {
    id?: boolean
    seminar_id?: boolean
    account_id?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type seminar_participantsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "seminar_id" | "account_id" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["seminar_participants"]>
  export type seminar_participantsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    seminar?: boolean | seminarsDefaultArgs<ExtArgs>
    account?: boolean | accountsDefaultArgs<ExtArgs>
  }

  export type $seminar_participantsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "seminar_participants"
    objects: {
      seminar: Prisma.$seminarsPayload<ExtArgs>
      account: Prisma.$accountsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seminar_id: string
      account_id: string
      status: $Enums.participant_status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["seminar_participants"]>
    composites: {}
  }

  type seminar_participantsGetPayload<S extends boolean | null | undefined | seminar_participantsDefaultArgs> = $Result.GetResult<Prisma.$seminar_participantsPayload, S>

  type seminar_participantsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<seminar_participantsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Seminar_participantsCountAggregateInputType | true
    }

  export interface seminar_participantsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['seminar_participants'], meta: { name: 'seminar_participants' } }
    /**
     * Find zero or one Seminar_participants that matches the filter.
     * @param {seminar_participantsFindUniqueArgs} args - Arguments to find a Seminar_participants
     * @example
     * // Get one Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends seminar_participantsFindUniqueArgs>(args: SelectSubset<T, seminar_participantsFindUniqueArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Seminar_participants that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {seminar_participantsFindUniqueOrThrowArgs} args - Arguments to find a Seminar_participants
     * @example
     * // Get one Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends seminar_participantsFindUniqueOrThrowArgs>(args: SelectSubset<T, seminar_participantsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminar_participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsFindFirstArgs} args - Arguments to find a Seminar_participants
     * @example
     * // Get one Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends seminar_participantsFindFirstArgs>(args?: SelectSubset<T, seminar_participantsFindFirstArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Seminar_participants that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsFindFirstOrThrowArgs} args - Arguments to find a Seminar_participants
     * @example
     * // Get one Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends seminar_participantsFindFirstOrThrowArgs>(args?: SelectSubset<T, seminar_participantsFindFirstOrThrowArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Seminar_participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findMany()
     * 
     * // Get first 10 Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seminar_participantsWithIdOnly = await prisma.seminar_participants.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends seminar_participantsFindManyArgs>(args?: SelectSubset<T, seminar_participantsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Seminar_participants.
     * @param {seminar_participantsCreateArgs} args - Arguments to create a Seminar_participants.
     * @example
     * // Create one Seminar_participants
     * const Seminar_participants = await prisma.seminar_participants.create({
     *   data: {
     *     // ... data to create a Seminar_participants
     *   }
     * })
     * 
     */
    create<T extends seminar_participantsCreateArgs>(args: SelectSubset<T, seminar_participantsCreateArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Seminar_participants.
     * @param {seminar_participantsCreateManyArgs} args - Arguments to create many Seminar_participants.
     * @example
     * // Create many Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends seminar_participantsCreateManyArgs>(args?: SelectSubset<T, seminar_participantsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Seminar_participants.
     * @param {seminar_participantsDeleteArgs} args - Arguments to delete one Seminar_participants.
     * @example
     * // Delete one Seminar_participants
     * const Seminar_participants = await prisma.seminar_participants.delete({
     *   where: {
     *     // ... filter to delete one Seminar_participants
     *   }
     * })
     * 
     */
    delete<T extends seminar_participantsDeleteArgs>(args: SelectSubset<T, seminar_participantsDeleteArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Seminar_participants.
     * @param {seminar_participantsUpdateArgs} args - Arguments to update one Seminar_participants.
     * @example
     * // Update one Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends seminar_participantsUpdateArgs>(args: SelectSubset<T, seminar_participantsUpdateArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Seminar_participants.
     * @param {seminar_participantsDeleteManyArgs} args - Arguments to filter Seminar_participants to delete.
     * @example
     * // Delete a few Seminar_participants
     * const { count } = await prisma.seminar_participants.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends seminar_participantsDeleteManyArgs>(args?: SelectSubset<T, seminar_participantsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Seminar_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends seminar_participantsUpdateManyArgs>(args: SelectSubset<T, seminar_participantsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Seminar_participants.
     * @param {seminar_participantsUpsertArgs} args - Arguments to update or create a Seminar_participants.
     * @example
     * // Update or create a Seminar_participants
     * const seminar_participants = await prisma.seminar_participants.upsert({
     *   create: {
     *     // ... data to create a Seminar_participants
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Seminar_participants we want to update
     *   }
     * })
     */
    upsert<T extends seminar_participantsUpsertArgs>(args: SelectSubset<T, seminar_participantsUpsertArgs<ExtArgs>>): Prisma__seminar_participantsClient<$Result.GetResult<Prisma.$seminar_participantsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Seminar_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsCountArgs} args - Arguments to filter Seminar_participants to count.
     * @example
     * // Count the number of Seminar_participants
     * const count = await prisma.seminar_participants.count({
     *   where: {
     *     // ... the filter for the Seminar_participants we want to count
     *   }
     * })
    **/
    count<T extends seminar_participantsCountArgs>(
      args?: Subset<T, seminar_participantsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Seminar_participantsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Seminar_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Seminar_participantsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Seminar_participantsAggregateArgs>(args: Subset<T, Seminar_participantsAggregateArgs>): Prisma.PrismaPromise<GetSeminar_participantsAggregateType<T>>

    /**
     * Group by Seminar_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {seminar_participantsGroupByArgs} args - Group by arguments.
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
      T extends seminar_participantsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: seminar_participantsGroupByArgs['orderBy'] }
        : { orderBy?: seminar_participantsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, seminar_participantsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeminar_participantsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the seminar_participants model
   */
  readonly fields: seminar_participantsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for seminar_participants.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__seminar_participantsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    seminar<T extends seminarsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, seminarsDefaultArgs<ExtArgs>>): Prisma__seminarsClient<$Result.GetResult<Prisma.$seminarsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    account<T extends accountsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, accountsDefaultArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the seminar_participants model
   */
  interface seminar_participantsFieldRefs {
    readonly id: FieldRef<"seminar_participants", 'String'>
    readonly seminar_id: FieldRef<"seminar_participants", 'String'>
    readonly account_id: FieldRef<"seminar_participants", 'String'>
    readonly status: FieldRef<"seminar_participants", 'participant_status'>
    readonly createdAt: FieldRef<"seminar_participants", 'DateTime'>
    readonly updatedAt: FieldRef<"seminar_participants", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * seminar_participants findUnique
   */
  export type seminar_participantsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter, which seminar_participants to fetch.
     */
    where: seminar_participantsWhereUniqueInput
  }

  /**
   * seminar_participants findUniqueOrThrow
   */
  export type seminar_participantsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter, which seminar_participants to fetch.
     */
    where: seminar_participantsWhereUniqueInput
  }

  /**
   * seminar_participants findFirst
   */
  export type seminar_participantsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter, which seminar_participants to fetch.
     */
    where?: seminar_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminar_participants to fetch.
     */
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for seminar_participants.
     */
    cursor?: seminar_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminar_participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminar_participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of seminar_participants.
     */
    distinct?: Seminar_participantsScalarFieldEnum | Seminar_participantsScalarFieldEnum[]
  }

  /**
   * seminar_participants findFirstOrThrow
   */
  export type seminar_participantsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter, which seminar_participants to fetch.
     */
    where?: seminar_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminar_participants to fetch.
     */
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for seminar_participants.
     */
    cursor?: seminar_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminar_participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminar_participants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of seminar_participants.
     */
    distinct?: Seminar_participantsScalarFieldEnum | Seminar_participantsScalarFieldEnum[]
  }

  /**
   * seminar_participants findMany
   */
  export type seminar_participantsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter, which seminar_participants to fetch.
     */
    where?: seminar_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of seminar_participants to fetch.
     */
    orderBy?: seminar_participantsOrderByWithRelationInput | seminar_participantsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing seminar_participants.
     */
    cursor?: seminar_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` seminar_participants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` seminar_participants.
     */
    skip?: number
    distinct?: Seminar_participantsScalarFieldEnum | Seminar_participantsScalarFieldEnum[]
  }

  /**
   * seminar_participants create
   */
  export type seminar_participantsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * The data needed to create a seminar_participants.
     */
    data: XOR<seminar_participantsCreateInput, seminar_participantsUncheckedCreateInput>
  }

  /**
   * seminar_participants createMany
   */
  export type seminar_participantsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many seminar_participants.
     */
    data: seminar_participantsCreateManyInput | seminar_participantsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * seminar_participants update
   */
  export type seminar_participantsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * The data needed to update a seminar_participants.
     */
    data: XOR<seminar_participantsUpdateInput, seminar_participantsUncheckedUpdateInput>
    /**
     * Choose, which seminar_participants to update.
     */
    where: seminar_participantsWhereUniqueInput
  }

  /**
   * seminar_participants updateMany
   */
  export type seminar_participantsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update seminar_participants.
     */
    data: XOR<seminar_participantsUpdateManyMutationInput, seminar_participantsUncheckedUpdateManyInput>
    /**
     * Filter which seminar_participants to update
     */
    where?: seminar_participantsWhereInput
    /**
     * Limit how many seminar_participants to update.
     */
    limit?: number
  }

  /**
   * seminar_participants upsert
   */
  export type seminar_participantsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * The filter to search for the seminar_participants to update in case it exists.
     */
    where: seminar_participantsWhereUniqueInput
    /**
     * In case the seminar_participants found by the `where` argument doesn't exist, create a new seminar_participants with this data.
     */
    create: XOR<seminar_participantsCreateInput, seminar_participantsUncheckedCreateInput>
    /**
     * In case the seminar_participants was found with the provided `where` argument, update it with this data.
     */
    update: XOR<seminar_participantsUpdateInput, seminar_participantsUncheckedUpdateInput>
  }

  /**
   * seminar_participants delete
   */
  export type seminar_participantsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
    /**
     * Filter which seminar_participants to delete.
     */
    where: seminar_participantsWhereUniqueInput
  }

  /**
   * seminar_participants deleteMany
   */
  export type seminar_participantsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which seminar_participants to delete
     */
    where?: seminar_participantsWhereInput
    /**
     * Limit how many seminar_participants to delete.
     */
    limit?: number
  }

  /**
   * seminar_participants without action
   */
  export type seminar_participantsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the seminar_participants
     */
    select?: seminar_participantsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the seminar_participants
     */
    omit?: seminar_participantsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: seminar_participantsInclude<ExtArgs> | null
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


  export const AccountsScalarFieldEnum: {
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

  export type AccountsScalarFieldEnum = (typeof AccountsScalarFieldEnum)[keyof typeof AccountsScalarFieldEnum]


  export const CommoditiesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CommoditiesScalarFieldEnum = (typeof CommoditiesScalarFieldEnum)[keyof typeof CommoditiesScalarFieldEnum]


  export const Accounts_commoditiesScalarFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    commodity_id: 'commodity_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Accounts_commoditiesScalarFieldEnum = (typeof Accounts_commoditiesScalarFieldEnum)[keyof typeof Accounts_commoditiesScalarFieldEnum]


  export const Inventory_itemsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Inventory_itemsScalarFieldEnum = (typeof Inventory_itemsScalarFieldEnum)[keyof typeof Inventory_itemsScalarFieldEnum]


  export const Inventory_categoriesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Inventory_categoriesScalarFieldEnum = (typeof Inventory_categoriesScalarFieldEnum)[keyof typeof Inventory_categoriesScalarFieldEnum]


  export const Item_stacksScalarFieldEnum: {
    id: 'id',
    itemId: 'itemId',
    quantity: 'quantity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Item_stacksScalarFieldEnum = (typeof Item_stacksScalarFieldEnum)[keyof typeof Item_stacksScalarFieldEnum]


  export const SeminarsScalarFieldEnum: {
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

  export type SeminarsScalarFieldEnum = (typeof SeminarsScalarFieldEnum)[keyof typeof SeminarsScalarFieldEnum]


  export const Seminar_participantsScalarFieldEnum: {
    id: 'id',
    seminar_id: 'seminar_id',
    account_id: 'account_id',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Seminar_participantsScalarFieldEnum = (typeof Seminar_participantsScalarFieldEnum)[keyof typeof Seminar_participantsScalarFieldEnum]


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


  export const accountsOrderByRelevanceFieldEnum: {
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

  export type accountsOrderByRelevanceFieldEnum = (typeof accountsOrderByRelevanceFieldEnum)[keyof typeof accountsOrderByRelevanceFieldEnum]


  export const commoditiesOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description'
  };

  export type commoditiesOrderByRelevanceFieldEnum = (typeof commoditiesOrderByRelevanceFieldEnum)[keyof typeof commoditiesOrderByRelevanceFieldEnum]


  export const accounts_commoditiesOrderByRelevanceFieldEnum: {
    id: 'id',
    account_id: 'account_id',
    commodity_id: 'commodity_id'
  };

  export type accounts_commoditiesOrderByRelevanceFieldEnum = (typeof accounts_commoditiesOrderByRelevanceFieldEnum)[keyof typeof accounts_commoditiesOrderByRelevanceFieldEnum]


  export const inventory_itemsOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId'
  };

  export type inventory_itemsOrderByRelevanceFieldEnum = (typeof inventory_itemsOrderByRelevanceFieldEnum)[keyof typeof inventory_itemsOrderByRelevanceFieldEnum]


  export const inventory_categoriesOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    icon: 'icon',
    description: 'description'
  };

  export type inventory_categoriesOrderByRelevanceFieldEnum = (typeof inventory_categoriesOrderByRelevanceFieldEnum)[keyof typeof inventory_categoriesOrderByRelevanceFieldEnum]


  export const item_stacksOrderByRelevanceFieldEnum: {
    id: 'id',
    itemId: 'itemId'
  };

  export type item_stacksOrderByRelevanceFieldEnum = (typeof item_stacksOrderByRelevanceFieldEnum)[keyof typeof item_stacksOrderByRelevanceFieldEnum]


  export const seminarsOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    speaker: 'speaker',
    photo: 'photo'
  };

  export type seminarsOrderByRelevanceFieldEnum = (typeof seminarsOrderByRelevanceFieldEnum)[keyof typeof seminarsOrderByRelevanceFieldEnum]


  export const seminar_participantsOrderByRelevanceFieldEnum: {
    id: 'id',
    seminar_id: 'seminar_id',
    account_id: 'account_id'
  };

  export type seminar_participantsOrderByRelevanceFieldEnum = (typeof seminar_participantsOrderByRelevanceFieldEnum)[keyof typeof seminar_participantsOrderByRelevanceFieldEnum]


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


  export type accountsWhereInput = {
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    id?: StringFilter<"accounts"> | string
    access?: EnumaccessFilter<"accounts"> | $Enums.access
    username?: StringFilter<"accounts"> | string
    email?: StringFilter<"accounts"> | string
    firstName?: StringFilter<"accounts"> | string
    lastName?: StringFilter<"accounts"> | string
    middleName?: StringNullableFilter<"accounts"> | string | null
    gender?: EnumgenderFilter<"accounts"> | $Enums.gender
    client_profile?: Enumclient_profileFilter<"accounts"> | $Enums.client_profile
    cellphone_no?: StringNullableFilter<"accounts"> | string | null
    telephone_no?: StringNullableFilter<"accounts"> | string | null
    occupation?: StringNullableFilter<"accounts"> | string | null
    position?: StringNullableFilter<"accounts"> | string | null
    address?: StringNullableFilter<"accounts"> | string | null
    picture?: StringNullableFilter<"accounts"> | string | null
    password?: StringFilter<"accounts"> | string
    createdAt?: DateTimeFilter<"accounts"> | Date | string
    updatedAt?: DateTimeFilter<"accounts"> | Date | string
    commodity?: Accounts_commoditiesListRelationFilter
    seminars?: Seminar_participantsListRelationFilter
  }

  export type accountsOrderByWithRelationInput = {
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
    commodity?: accounts_commoditiesOrderByRelationAggregateInput
    seminars?: seminar_participantsOrderByRelationAggregateInput
    _relevance?: accountsOrderByRelevanceInput
  }

  export type accountsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    access?: EnumaccessFilter<"accounts"> | $Enums.access
    firstName?: StringFilter<"accounts"> | string
    lastName?: StringFilter<"accounts"> | string
    middleName?: StringNullableFilter<"accounts"> | string | null
    gender?: EnumgenderFilter<"accounts"> | $Enums.gender
    client_profile?: Enumclient_profileFilter<"accounts"> | $Enums.client_profile
    cellphone_no?: StringNullableFilter<"accounts"> | string | null
    telephone_no?: StringNullableFilter<"accounts"> | string | null
    occupation?: StringNullableFilter<"accounts"> | string | null
    position?: StringNullableFilter<"accounts"> | string | null
    address?: StringNullableFilter<"accounts"> | string | null
    picture?: StringNullableFilter<"accounts"> | string | null
    password?: StringFilter<"accounts"> | string
    createdAt?: DateTimeFilter<"accounts"> | Date | string
    updatedAt?: DateTimeFilter<"accounts"> | Date | string
    commodity?: Accounts_commoditiesListRelationFilter
    seminars?: Seminar_participantsListRelationFilter
  }, "id" | "username" | "email">

  export type accountsOrderByWithAggregationInput = {
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
    _count?: accountsCountOrderByAggregateInput
    _max?: accountsMaxOrderByAggregateInput
    _min?: accountsMinOrderByAggregateInput
  }

  export type accountsScalarWhereWithAggregatesInput = {
    AND?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    OR?: accountsScalarWhereWithAggregatesInput[]
    NOT?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"accounts"> | string
    access?: EnumaccessWithAggregatesFilter<"accounts"> | $Enums.access
    username?: StringWithAggregatesFilter<"accounts"> | string
    email?: StringWithAggregatesFilter<"accounts"> | string
    firstName?: StringWithAggregatesFilter<"accounts"> | string
    lastName?: StringWithAggregatesFilter<"accounts"> | string
    middleName?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    gender?: EnumgenderWithAggregatesFilter<"accounts"> | $Enums.gender
    client_profile?: Enumclient_profileWithAggregatesFilter<"accounts"> | $Enums.client_profile
    cellphone_no?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    telephone_no?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    occupation?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    position?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    address?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    picture?: StringNullableWithAggregatesFilter<"accounts"> | string | null
    password?: StringWithAggregatesFilter<"accounts"> | string
    createdAt?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
  }

  export type commoditiesWhereInput = {
    AND?: commoditiesWhereInput | commoditiesWhereInput[]
    OR?: commoditiesWhereInput[]
    NOT?: commoditiesWhereInput | commoditiesWhereInput[]
    id?: StringFilter<"commodities"> | string
    name?: StringFilter<"commodities"> | string
    icon?: StringNullableFilter<"commodities"> | string | null
    description?: StringNullableFilter<"commodities"> | string | null
    createdAt?: DateTimeFilter<"commodities"> | Date | string
    updatedAt?: DateTimeFilter<"commodities"> | Date | string
    accounts?: Accounts_commoditiesListRelationFilter
  }

  export type commoditiesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: accounts_commoditiesOrderByRelationAggregateInput
    _relevance?: commoditiesOrderByRelevanceInput
  }

  export type commoditiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: commoditiesWhereInput | commoditiesWhereInput[]
    OR?: commoditiesWhereInput[]
    NOT?: commoditiesWhereInput | commoditiesWhereInput[]
    icon?: StringNullableFilter<"commodities"> | string | null
    description?: StringNullableFilter<"commodities"> | string | null
    createdAt?: DateTimeFilter<"commodities"> | Date | string
    updatedAt?: DateTimeFilter<"commodities"> | Date | string
    accounts?: Accounts_commoditiesListRelationFilter
  }, "id" | "name">

  export type commoditiesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: commoditiesCountOrderByAggregateInput
    _max?: commoditiesMaxOrderByAggregateInput
    _min?: commoditiesMinOrderByAggregateInput
  }

  export type commoditiesScalarWhereWithAggregatesInput = {
    AND?: commoditiesScalarWhereWithAggregatesInput | commoditiesScalarWhereWithAggregatesInput[]
    OR?: commoditiesScalarWhereWithAggregatesInput[]
    NOT?: commoditiesScalarWhereWithAggregatesInput | commoditiesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"commodities"> | string
    name?: StringWithAggregatesFilter<"commodities"> | string
    icon?: StringNullableWithAggregatesFilter<"commodities"> | string | null
    description?: StringNullableWithAggregatesFilter<"commodities"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"commodities"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"commodities"> | Date | string
  }

  export type accounts_commoditiesWhereInput = {
    AND?: accounts_commoditiesWhereInput | accounts_commoditiesWhereInput[]
    OR?: accounts_commoditiesWhereInput[]
    NOT?: accounts_commoditiesWhereInput | accounts_commoditiesWhereInput[]
    id?: StringFilter<"accounts_commodities"> | string
    account_id?: StringFilter<"accounts_commodities"> | string
    commodity_id?: StringFilter<"accounts_commodities"> | string
    createdAt?: DateTimeFilter<"accounts_commodities"> | Date | string
    updatedAt?: DateTimeFilter<"accounts_commodities"> | Date | string
    commodity?: XOR<CommoditiesScalarRelationFilter, commoditiesWhereInput>
    account?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }

  export type accounts_commoditiesOrderByWithRelationInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commodity?: commoditiesOrderByWithRelationInput
    account?: accountsOrderByWithRelationInput
    _relevance?: accounts_commoditiesOrderByRelevanceInput
  }

  export type accounts_commoditiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    account_id_commodity_id?: accounts_commoditiesAccount_idCommodity_idCompoundUniqueInput
    AND?: accounts_commoditiesWhereInput | accounts_commoditiesWhereInput[]
    OR?: accounts_commoditiesWhereInput[]
    NOT?: accounts_commoditiesWhereInput | accounts_commoditiesWhereInput[]
    account_id?: StringFilter<"accounts_commodities"> | string
    commodity_id?: StringFilter<"accounts_commodities"> | string
    createdAt?: DateTimeFilter<"accounts_commodities"> | Date | string
    updatedAt?: DateTimeFilter<"accounts_commodities"> | Date | string
    commodity?: XOR<CommoditiesScalarRelationFilter, commoditiesWhereInput>
    account?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }, "id" | "account_id_commodity_id">

  export type accounts_commoditiesOrderByWithAggregationInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: accounts_commoditiesCountOrderByAggregateInput
    _max?: accounts_commoditiesMaxOrderByAggregateInput
    _min?: accounts_commoditiesMinOrderByAggregateInput
  }

  export type accounts_commoditiesScalarWhereWithAggregatesInput = {
    AND?: accounts_commoditiesScalarWhereWithAggregatesInput | accounts_commoditiesScalarWhereWithAggregatesInput[]
    OR?: accounts_commoditiesScalarWhereWithAggregatesInput[]
    NOT?: accounts_commoditiesScalarWhereWithAggregatesInput | accounts_commoditiesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"accounts_commodities"> | string
    account_id?: StringWithAggregatesFilter<"accounts_commodities"> | string
    commodity_id?: StringWithAggregatesFilter<"accounts_commodities"> | string
    createdAt?: DateTimeWithAggregatesFilter<"accounts_commodities"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"accounts_commodities"> | Date | string
  }

  export type inventory_itemsWhereInput = {
    AND?: inventory_itemsWhereInput | inventory_itemsWhereInput[]
    OR?: inventory_itemsWhereInput[]
    NOT?: inventory_itemsWhereInput | inventory_itemsWhereInput[]
    id?: StringFilter<"inventory_items"> | string
    name?: StringFilter<"inventory_items"> | string
    description?: StringNullableFilter<"inventory_items"> | string | null
    categoryId?: StringFilter<"inventory_items"> | string
    createdAt?: DateTimeFilter<"inventory_items"> | Date | string
    updatedAt?: DateTimeFilter<"inventory_items"> | Date | string
    item_stacks?: Item_stacksListRelationFilter
    category?: XOR<Inventory_categoriesScalarRelationFilter, inventory_categoriesWhereInput>
  }

  export type inventory_itemsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item_stacks?: item_stacksOrderByRelationAggregateInput
    category?: inventory_categoriesOrderByWithRelationInput
    _relevance?: inventory_itemsOrderByRelevanceInput
  }

  export type inventory_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: inventory_itemsWhereInput | inventory_itemsWhereInput[]
    OR?: inventory_itemsWhereInput[]
    NOT?: inventory_itemsWhereInput | inventory_itemsWhereInput[]
    description?: StringNullableFilter<"inventory_items"> | string | null
    categoryId?: StringFilter<"inventory_items"> | string
    createdAt?: DateTimeFilter<"inventory_items"> | Date | string
    updatedAt?: DateTimeFilter<"inventory_items"> | Date | string
    item_stacks?: Item_stacksListRelationFilter
    category?: XOR<Inventory_categoriesScalarRelationFilter, inventory_categoriesWhereInput>
  }, "id" | "name">

  export type inventory_itemsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: inventory_itemsCountOrderByAggregateInput
    _max?: inventory_itemsMaxOrderByAggregateInput
    _min?: inventory_itemsMinOrderByAggregateInput
  }

  export type inventory_itemsScalarWhereWithAggregatesInput = {
    AND?: inventory_itemsScalarWhereWithAggregatesInput | inventory_itemsScalarWhereWithAggregatesInput[]
    OR?: inventory_itemsScalarWhereWithAggregatesInput[]
    NOT?: inventory_itemsScalarWhereWithAggregatesInput | inventory_itemsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"inventory_items"> | string
    name?: StringWithAggregatesFilter<"inventory_items"> | string
    description?: StringNullableWithAggregatesFilter<"inventory_items"> | string | null
    categoryId?: StringWithAggregatesFilter<"inventory_items"> | string
    createdAt?: DateTimeWithAggregatesFilter<"inventory_items"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"inventory_items"> | Date | string
  }

  export type inventory_categoriesWhereInput = {
    AND?: inventory_categoriesWhereInput | inventory_categoriesWhereInput[]
    OR?: inventory_categoriesWhereInput[]
    NOT?: inventory_categoriesWhereInput | inventory_categoriesWhereInput[]
    id?: StringFilter<"inventory_categories"> | string
    name?: StringFilter<"inventory_categories"> | string
    icon?: StringNullableFilter<"inventory_categories"> | string | null
    description?: StringNullableFilter<"inventory_categories"> | string | null
    createdAt?: DateTimeFilter<"inventory_categories"> | Date | string
    updatedAt?: DateTimeFilter<"inventory_categories"> | Date | string
    items?: Inventory_itemsListRelationFilter
  }

  export type inventory_categoriesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: inventory_itemsOrderByRelationAggregateInput
    _relevance?: inventory_categoriesOrderByRelevanceInput
  }

  export type inventory_categoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: inventory_categoriesWhereInput | inventory_categoriesWhereInput[]
    OR?: inventory_categoriesWhereInput[]
    NOT?: inventory_categoriesWhereInput | inventory_categoriesWhereInput[]
    icon?: StringNullableFilter<"inventory_categories"> | string | null
    description?: StringNullableFilter<"inventory_categories"> | string | null
    createdAt?: DateTimeFilter<"inventory_categories"> | Date | string
    updatedAt?: DateTimeFilter<"inventory_categories"> | Date | string
    items?: Inventory_itemsListRelationFilter
  }, "id" | "name">

  export type inventory_categoriesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: inventory_categoriesCountOrderByAggregateInput
    _max?: inventory_categoriesMaxOrderByAggregateInput
    _min?: inventory_categoriesMinOrderByAggregateInput
  }

  export type inventory_categoriesScalarWhereWithAggregatesInput = {
    AND?: inventory_categoriesScalarWhereWithAggregatesInput | inventory_categoriesScalarWhereWithAggregatesInput[]
    OR?: inventory_categoriesScalarWhereWithAggregatesInput[]
    NOT?: inventory_categoriesScalarWhereWithAggregatesInput | inventory_categoriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"inventory_categories"> | string
    name?: StringWithAggregatesFilter<"inventory_categories"> | string
    icon?: StringNullableWithAggregatesFilter<"inventory_categories"> | string | null
    description?: StringNullableWithAggregatesFilter<"inventory_categories"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"inventory_categories"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"inventory_categories"> | Date | string
  }

  export type item_stacksWhereInput = {
    AND?: item_stacksWhereInput | item_stacksWhereInput[]
    OR?: item_stacksWhereInput[]
    NOT?: item_stacksWhereInput | item_stacksWhereInput[]
    id?: StringFilter<"item_stacks"> | string
    itemId?: StringFilter<"item_stacks"> | string
    quantity?: IntFilter<"item_stacks"> | number
    status?: Enumitem_statusFilter<"item_stacks"> | $Enums.item_status
    createdAt?: DateTimeFilter<"item_stacks"> | Date | string
    updatedAt?: DateTimeFilter<"item_stacks"> | Date | string
    item?: XOR<Inventory_itemsScalarRelationFilter, inventory_itemsWhereInput>
  }

  export type item_stacksOrderByWithRelationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    item?: inventory_itemsOrderByWithRelationInput
    _relevance?: item_stacksOrderByRelevanceInput
  }

  export type item_stacksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: item_stacksWhereInput | item_stacksWhereInput[]
    OR?: item_stacksWhereInput[]
    NOT?: item_stacksWhereInput | item_stacksWhereInput[]
    itemId?: StringFilter<"item_stacks"> | string
    quantity?: IntFilter<"item_stacks"> | number
    status?: Enumitem_statusFilter<"item_stacks"> | $Enums.item_status
    createdAt?: DateTimeFilter<"item_stacks"> | Date | string
    updatedAt?: DateTimeFilter<"item_stacks"> | Date | string
    item?: XOR<Inventory_itemsScalarRelationFilter, inventory_itemsWhereInput>
  }, "id">

  export type item_stacksOrderByWithAggregationInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: item_stacksCountOrderByAggregateInput
    _avg?: item_stacksAvgOrderByAggregateInput
    _max?: item_stacksMaxOrderByAggregateInput
    _min?: item_stacksMinOrderByAggregateInput
    _sum?: item_stacksSumOrderByAggregateInput
  }

  export type item_stacksScalarWhereWithAggregatesInput = {
    AND?: item_stacksScalarWhereWithAggregatesInput | item_stacksScalarWhereWithAggregatesInput[]
    OR?: item_stacksScalarWhereWithAggregatesInput[]
    NOT?: item_stacksScalarWhereWithAggregatesInput | item_stacksScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"item_stacks"> | string
    itemId?: StringWithAggregatesFilter<"item_stacks"> | string
    quantity?: IntWithAggregatesFilter<"item_stacks"> | number
    status?: Enumitem_statusWithAggregatesFilter<"item_stacks"> | $Enums.item_status
    createdAt?: DateTimeWithAggregatesFilter<"item_stacks"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"item_stacks"> | Date | string
  }

  export type seminarsWhereInput = {
    AND?: seminarsWhereInput | seminarsWhereInput[]
    OR?: seminarsWhereInput[]
    NOT?: seminarsWhereInput | seminarsWhereInput[]
    id?: StringFilter<"seminars"> | string
    title?: StringFilter<"seminars"> | string
    description?: StringFilter<"seminars"> | string
    location?: StringFilter<"seminars"> | string
    speaker?: StringFilter<"seminars"> | string
    start_date?: DateTimeFilter<"seminars"> | Date | string
    end_date?: DateTimeFilter<"seminars"> | Date | string
    start_time?: DateTimeFilter<"seminars"> | Date | string
    end_time?: DateTimeFilter<"seminars"> | Date | string
    capacity?: IntFilter<"seminars"> | number
    registration_deadline?: DateTimeFilter<"seminars"> | Date | string
    status?: Enumseminar_statusFilter<"seminars"> | $Enums.seminar_status
    photo?: StringNullableFilter<"seminars"> | string | null
    createdAt?: DateTimeFilter<"seminars"> | Date | string
    updatedAt?: DateTimeFilter<"seminars"> | Date | string
    participants?: Seminar_participantsListRelationFilter
  }

  export type seminarsOrderByWithRelationInput = {
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
    participants?: seminar_participantsOrderByRelationAggregateInput
    _relevance?: seminarsOrderByRelevanceInput
  }

  export type seminarsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: seminarsWhereInput | seminarsWhereInput[]
    OR?: seminarsWhereInput[]
    NOT?: seminarsWhereInput | seminarsWhereInput[]
    title?: StringFilter<"seminars"> | string
    description?: StringFilter<"seminars"> | string
    location?: StringFilter<"seminars"> | string
    speaker?: StringFilter<"seminars"> | string
    start_date?: DateTimeFilter<"seminars"> | Date | string
    end_date?: DateTimeFilter<"seminars"> | Date | string
    start_time?: DateTimeFilter<"seminars"> | Date | string
    end_time?: DateTimeFilter<"seminars"> | Date | string
    capacity?: IntFilter<"seminars"> | number
    registration_deadline?: DateTimeFilter<"seminars"> | Date | string
    status?: Enumseminar_statusFilter<"seminars"> | $Enums.seminar_status
    photo?: StringNullableFilter<"seminars"> | string | null
    createdAt?: DateTimeFilter<"seminars"> | Date | string
    updatedAt?: DateTimeFilter<"seminars"> | Date | string
    participants?: Seminar_participantsListRelationFilter
  }, "id">

  export type seminarsOrderByWithAggregationInput = {
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
    _count?: seminarsCountOrderByAggregateInput
    _avg?: seminarsAvgOrderByAggregateInput
    _max?: seminarsMaxOrderByAggregateInput
    _min?: seminarsMinOrderByAggregateInput
    _sum?: seminarsSumOrderByAggregateInput
  }

  export type seminarsScalarWhereWithAggregatesInput = {
    AND?: seminarsScalarWhereWithAggregatesInput | seminarsScalarWhereWithAggregatesInput[]
    OR?: seminarsScalarWhereWithAggregatesInput[]
    NOT?: seminarsScalarWhereWithAggregatesInput | seminarsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"seminars"> | string
    title?: StringWithAggregatesFilter<"seminars"> | string
    description?: StringWithAggregatesFilter<"seminars"> | string
    location?: StringWithAggregatesFilter<"seminars"> | string
    speaker?: StringWithAggregatesFilter<"seminars"> | string
    start_date?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    end_date?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    start_time?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    end_time?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    capacity?: IntWithAggregatesFilter<"seminars"> | number
    registration_deadline?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    status?: Enumseminar_statusWithAggregatesFilter<"seminars"> | $Enums.seminar_status
    photo?: StringNullableWithAggregatesFilter<"seminars"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"seminars"> | Date | string
  }

  export type seminar_participantsWhereInput = {
    AND?: seminar_participantsWhereInput | seminar_participantsWhereInput[]
    OR?: seminar_participantsWhereInput[]
    NOT?: seminar_participantsWhereInput | seminar_participantsWhereInput[]
    id?: StringFilter<"seminar_participants"> | string
    seminar_id?: StringFilter<"seminar_participants"> | string
    account_id?: StringFilter<"seminar_participants"> | string
    status?: Enumparticipant_statusFilter<"seminar_participants"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"seminar_participants"> | Date | string
    updatedAt?: DateTimeFilter<"seminar_participants"> | Date | string
    seminar?: XOR<SeminarsScalarRelationFilter, seminarsWhereInput>
    account?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }

  export type seminar_participantsOrderByWithRelationInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    seminar?: seminarsOrderByWithRelationInput
    account?: accountsOrderByWithRelationInput
    _relevance?: seminar_participantsOrderByRelevanceInput
  }

  export type seminar_participantsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    seminar_id_account_id?: seminar_participantsSeminar_idAccount_idCompoundUniqueInput
    AND?: seminar_participantsWhereInput | seminar_participantsWhereInput[]
    OR?: seminar_participantsWhereInput[]
    NOT?: seminar_participantsWhereInput | seminar_participantsWhereInput[]
    seminar_id?: StringFilter<"seminar_participants"> | string
    account_id?: StringFilter<"seminar_participants"> | string
    status?: Enumparticipant_statusFilter<"seminar_participants"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"seminar_participants"> | Date | string
    updatedAt?: DateTimeFilter<"seminar_participants"> | Date | string
    seminar?: XOR<SeminarsScalarRelationFilter, seminarsWhereInput>
    account?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }, "id" | "seminar_id_account_id">

  export type seminar_participantsOrderByWithAggregationInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: seminar_participantsCountOrderByAggregateInput
    _max?: seminar_participantsMaxOrderByAggregateInput
    _min?: seminar_participantsMinOrderByAggregateInput
  }

  export type seminar_participantsScalarWhereWithAggregatesInput = {
    AND?: seminar_participantsScalarWhereWithAggregatesInput | seminar_participantsScalarWhereWithAggregatesInput[]
    OR?: seminar_participantsScalarWhereWithAggregatesInput[]
    NOT?: seminar_participantsScalarWhereWithAggregatesInput | seminar_participantsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"seminar_participants"> | string
    seminar_id?: StringWithAggregatesFilter<"seminar_participants"> | string
    account_id?: StringWithAggregatesFilter<"seminar_participants"> | string
    status?: Enumparticipant_statusWithAggregatesFilter<"seminar_participants"> | $Enums.participant_status
    createdAt?: DateTimeWithAggregatesFilter<"seminar_participants"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"seminar_participants"> | Date | string
  }

  export type accountsCreateInput = {
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
    commodity?: accounts_commoditiesCreateNestedManyWithoutAccountInput
    seminars?: seminar_participantsCreateNestedManyWithoutAccountInput
  }

  export type accountsUncheckedCreateInput = {
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
    commodity?: accounts_commoditiesUncheckedCreateNestedManyWithoutAccountInput
    seminars?: seminar_participantsUncheckedCreateNestedManyWithoutAccountInput
  }

  export type accountsUpdateInput = {
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
    commodity?: accounts_commoditiesUpdateManyWithoutAccountNestedInput
    seminars?: seminar_participantsUpdateManyWithoutAccountNestedInput
  }

  export type accountsUncheckedUpdateInput = {
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
    commodity?: accounts_commoditiesUncheckedUpdateManyWithoutAccountNestedInput
    seminars?: seminar_participantsUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type accountsCreateManyInput = {
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

  export type accountsUpdateManyMutationInput = {
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

  export type accountsUncheckedUpdateManyInput = {
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

  export type commoditiesCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: accounts_commoditiesCreateNestedManyWithoutCommodityInput
  }

  export type commoditiesUncheckedCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: accounts_commoditiesUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type commoditiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accounts_commoditiesUpdateManyWithoutCommodityNestedInput
  }

  export type commoditiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accounts_commoditiesUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type commoditiesCreateManyInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type commoditiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commoditiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity: commoditiesCreateNestedOneWithoutAccountsInput
    account: accountsCreateNestedOneWithoutCommodityInput
  }

  export type accounts_commoditiesUncheckedCreateInput = {
    id?: string
    account_id: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: commoditiesUpdateOneRequiredWithoutAccountsNestedInput
    account?: accountsUpdateOneRequiredWithoutCommodityNestedInput
  }

  export type accounts_commoditiesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesCreateManyInput = {
    id?: string
    account_id: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_itemsCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: item_stacksCreateNestedManyWithoutItemInput
    category: inventory_categoriesCreateNestedOneWithoutItemsInput
  }

  export type inventory_itemsUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: item_stacksUncheckedCreateNestedManyWithoutItemInput
  }

  export type inventory_itemsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: item_stacksUpdateManyWithoutItemNestedInput
    category?: inventory_categoriesUpdateOneRequiredWithoutItemsNestedInput
  }

  export type inventory_itemsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: item_stacksUncheckedUpdateManyWithoutItemNestedInput
  }

  export type inventory_itemsCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_itemsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_itemsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_categoriesCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: inventory_itemsCreateNestedManyWithoutCategoryInput
  }

  export type inventory_categoriesUncheckedCreateInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: inventory_itemsUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type inventory_categoriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: inventory_itemsUpdateManyWithoutCategoryNestedInput
  }

  export type inventory_categoriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: inventory_itemsUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type inventory_categoriesCreateManyInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_categoriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_categoriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksCreateInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
    item: inventory_itemsCreateNestedOneWithoutItem_stacksInput
  }

  export type item_stacksUncheckedCreateInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type item_stacksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: inventory_itemsUpdateOneRequiredWithoutItem_stacksNestedInput
  }

  export type item_stacksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksCreateManyInput = {
    id?: string
    itemId: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type item_stacksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminarsCreateInput = {
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
    participants?: seminar_participantsCreateNestedManyWithoutSeminarInput
  }

  export type seminarsUncheckedCreateInput = {
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
    participants?: seminar_participantsUncheckedCreateNestedManyWithoutSeminarInput
  }

  export type seminarsUpdateInput = {
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
    participants?: seminar_participantsUpdateManyWithoutSeminarNestedInput
  }

  export type seminarsUncheckedUpdateInput = {
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
    participants?: seminar_participantsUncheckedUpdateManyWithoutSeminarNestedInput
  }

  export type seminarsCreateManyInput = {
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

  export type seminarsUpdateManyMutationInput = {
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

  export type seminarsUncheckedUpdateManyInput = {
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

  export type seminar_participantsCreateInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    seminar: seminarsCreateNestedOneWithoutParticipantsInput
    account: accountsCreateNestedOneWithoutSeminarsInput
  }

  export type seminar_participantsUncheckedCreateInput = {
    id?: string
    seminar_id: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminar?: seminarsUpdateOneRequiredWithoutParticipantsNestedInput
    account?: accountsUpdateOneRequiredWithoutSeminarsNestedInput
  }

  export type seminar_participantsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsCreateManyInput = {
    id?: string
    seminar_id: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsUncheckedUpdateManyInput = {
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

  export type Accounts_commoditiesListRelationFilter = {
    every?: accounts_commoditiesWhereInput
    some?: accounts_commoditiesWhereInput
    none?: accounts_commoditiesWhereInput
  }

  export type Seminar_participantsListRelationFilter = {
    every?: seminar_participantsWhereInput
    some?: seminar_participantsWhereInput
    none?: seminar_participantsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type accounts_commoditiesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type seminar_participantsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type accountsOrderByRelevanceInput = {
    fields: accountsOrderByRelevanceFieldEnum | accountsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type accountsCountOrderByAggregateInput = {
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

  export type accountsMaxOrderByAggregateInput = {
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

  export type accountsMinOrderByAggregateInput = {
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

  export type commoditiesOrderByRelevanceInput = {
    fields: commoditiesOrderByRelevanceFieldEnum | commoditiesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type commoditiesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type commoditiesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type commoditiesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CommoditiesScalarRelationFilter = {
    is?: commoditiesWhereInput
    isNot?: commoditiesWhereInput
  }

  export type AccountsScalarRelationFilter = {
    is?: accountsWhereInput
    isNot?: accountsWhereInput
  }

  export type accounts_commoditiesOrderByRelevanceInput = {
    fields: accounts_commoditiesOrderByRelevanceFieldEnum | accounts_commoditiesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type accounts_commoditiesAccount_idCommodity_idCompoundUniqueInput = {
    account_id: string
    commodity_id: string
  }

  export type accounts_commoditiesCountOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type accounts_commoditiesMaxOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type accounts_commoditiesMinOrderByAggregateInput = {
    id?: SortOrder
    account_id?: SortOrder
    commodity_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Item_stacksListRelationFilter = {
    every?: item_stacksWhereInput
    some?: item_stacksWhereInput
    none?: item_stacksWhereInput
  }

  export type Inventory_categoriesScalarRelationFilter = {
    is?: inventory_categoriesWhereInput
    isNot?: inventory_categoriesWhereInput
  }

  export type item_stacksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type inventory_itemsOrderByRelevanceInput = {
    fields: inventory_itemsOrderByRelevanceFieldEnum | inventory_itemsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type inventory_itemsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type inventory_itemsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type inventory_itemsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type Inventory_itemsListRelationFilter = {
    every?: inventory_itemsWhereInput
    some?: inventory_itemsWhereInput
    none?: inventory_itemsWhereInput
  }

  export type inventory_itemsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type inventory_categoriesOrderByRelevanceInput = {
    fields: inventory_categoriesOrderByRelevanceFieldEnum | inventory_categoriesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type inventory_categoriesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type inventory_categoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type inventory_categoriesMinOrderByAggregateInput = {
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

  export type Inventory_itemsScalarRelationFilter = {
    is?: inventory_itemsWhereInput
    isNot?: inventory_itemsWhereInput
  }

  export type item_stacksOrderByRelevanceInput = {
    fields: item_stacksOrderByRelevanceFieldEnum | item_stacksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type item_stacksCountOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type item_stacksAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type item_stacksMaxOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type item_stacksMinOrderByAggregateInput = {
    id?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type item_stacksSumOrderByAggregateInput = {
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

  export type seminarsOrderByRelevanceInput = {
    fields: seminarsOrderByRelevanceFieldEnum | seminarsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type seminarsCountOrderByAggregateInput = {
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

  export type seminarsAvgOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type seminarsMaxOrderByAggregateInput = {
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

  export type seminarsMinOrderByAggregateInput = {
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

  export type seminarsSumOrderByAggregateInput = {
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

  export type SeminarsScalarRelationFilter = {
    is?: seminarsWhereInput
    isNot?: seminarsWhereInput
  }

  export type seminar_participantsOrderByRelevanceInput = {
    fields: seminar_participantsOrderByRelevanceFieldEnum | seminar_participantsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type seminar_participantsSeminar_idAccount_idCompoundUniqueInput = {
    seminar_id: string
    account_id: string
  }

  export type seminar_participantsCountOrderByAggregateInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type seminar_participantsMaxOrderByAggregateInput = {
    id?: SortOrder
    seminar_id?: SortOrder
    account_id?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type seminar_participantsMinOrderByAggregateInput = {
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

  export type accounts_commoditiesCreateNestedManyWithoutAccountInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
  }

  export type seminar_participantsCreateNestedManyWithoutAccountInput = {
    create?: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput> | seminar_participantsCreateWithoutAccountInput[] | seminar_participantsUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutAccountInput | seminar_participantsCreateOrConnectWithoutAccountInput[]
    createMany?: seminar_participantsCreateManyAccountInputEnvelope
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
  }

  export type accounts_commoditiesUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
  }

  export type seminar_participantsUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput> | seminar_participantsCreateWithoutAccountInput[] | seminar_participantsUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutAccountInput | seminar_participantsCreateOrConnectWithoutAccountInput[]
    createMany?: seminar_participantsCreateManyAccountInputEnvelope
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
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

  export type accounts_commoditiesUpdateManyWithoutAccountNestedInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    upsert?: accounts_commoditiesUpsertWithWhereUniqueWithoutAccountInput | accounts_commoditiesUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    set?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    disconnect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    delete?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    update?: accounts_commoditiesUpdateWithWhereUniqueWithoutAccountInput | accounts_commoditiesUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: accounts_commoditiesUpdateManyWithWhereWithoutAccountInput | accounts_commoditiesUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
  }

  export type seminar_participantsUpdateManyWithoutAccountNestedInput = {
    create?: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput> | seminar_participantsCreateWithoutAccountInput[] | seminar_participantsUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutAccountInput | seminar_participantsCreateOrConnectWithoutAccountInput[]
    upsert?: seminar_participantsUpsertWithWhereUniqueWithoutAccountInput | seminar_participantsUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: seminar_participantsCreateManyAccountInputEnvelope
    set?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    disconnect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    delete?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    update?: seminar_participantsUpdateWithWhereUniqueWithoutAccountInput | seminar_participantsUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: seminar_participantsUpdateManyWithWhereWithoutAccountInput | seminar_participantsUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
  }

  export type accounts_commoditiesUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    upsert?: accounts_commoditiesUpsertWithWhereUniqueWithoutAccountInput | accounts_commoditiesUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    set?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    disconnect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    delete?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    update?: accounts_commoditiesUpdateWithWhereUniqueWithoutAccountInput | accounts_commoditiesUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: accounts_commoditiesUpdateManyWithWhereWithoutAccountInput | accounts_commoditiesUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
  }

  export type seminar_participantsUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput> | seminar_participantsCreateWithoutAccountInput[] | seminar_participantsUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutAccountInput | seminar_participantsCreateOrConnectWithoutAccountInput[]
    upsert?: seminar_participantsUpsertWithWhereUniqueWithoutAccountInput | seminar_participantsUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: seminar_participantsCreateManyAccountInputEnvelope
    set?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    disconnect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    delete?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    update?: seminar_participantsUpdateWithWhereUniqueWithoutAccountInput | seminar_participantsUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: seminar_participantsUpdateManyWithWhereWithoutAccountInput | seminar_participantsUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
  }

  export type accounts_commoditiesCreateNestedManyWithoutCommodityInput = {
    create?: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput> | accounts_commoditiesCreateWithoutCommodityInput[] | accounts_commoditiesUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutCommodityInput | accounts_commoditiesCreateOrConnectWithoutCommodityInput[]
    createMany?: accounts_commoditiesCreateManyCommodityInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
  }

  export type accounts_commoditiesUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput> | accounts_commoditiesCreateWithoutCommodityInput[] | accounts_commoditiesUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutCommodityInput | accounts_commoditiesCreateOrConnectWithoutCommodityInput[]
    createMany?: accounts_commoditiesCreateManyCommodityInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
  }

  export type accounts_commoditiesUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput> | accounts_commoditiesCreateWithoutCommodityInput[] | accounts_commoditiesUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutCommodityInput | accounts_commoditiesCreateOrConnectWithoutCommodityInput[]
    upsert?: accounts_commoditiesUpsertWithWhereUniqueWithoutCommodityInput | accounts_commoditiesUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: accounts_commoditiesCreateManyCommodityInputEnvelope
    set?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    disconnect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    delete?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    update?: accounts_commoditiesUpdateWithWhereUniqueWithoutCommodityInput | accounts_commoditiesUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: accounts_commoditiesUpdateManyWithWhereWithoutCommodityInput | accounts_commoditiesUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
  }

  export type accounts_commoditiesUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput> | accounts_commoditiesCreateWithoutCommodityInput[] | accounts_commoditiesUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutCommodityInput | accounts_commoditiesCreateOrConnectWithoutCommodityInput[]
    upsert?: accounts_commoditiesUpsertWithWhereUniqueWithoutCommodityInput | accounts_commoditiesUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: accounts_commoditiesCreateManyCommodityInputEnvelope
    set?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    disconnect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    delete?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
    update?: accounts_commoditiesUpdateWithWhereUniqueWithoutCommodityInput | accounts_commoditiesUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: accounts_commoditiesUpdateManyWithWhereWithoutCommodityInput | accounts_commoditiesUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
  }

  export type commoditiesCreateNestedOneWithoutAccountsInput = {
    create?: XOR<commoditiesCreateWithoutAccountsInput, commoditiesUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: commoditiesCreateOrConnectWithoutAccountsInput
    connect?: commoditiesWhereUniqueInput
  }

  export type accountsCreateNestedOneWithoutCommodityInput = {
    create?: XOR<accountsCreateWithoutCommodityInput, accountsUncheckedCreateWithoutCommodityInput>
    connectOrCreate?: accountsCreateOrConnectWithoutCommodityInput
    connect?: accountsWhereUniqueInput
  }

  export type commoditiesUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<commoditiesCreateWithoutAccountsInput, commoditiesUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: commoditiesCreateOrConnectWithoutAccountsInput
    upsert?: commoditiesUpsertWithoutAccountsInput
    connect?: commoditiesWhereUniqueInput
    update?: XOR<XOR<commoditiesUpdateToOneWithWhereWithoutAccountsInput, commoditiesUpdateWithoutAccountsInput>, commoditiesUncheckedUpdateWithoutAccountsInput>
  }

  export type accountsUpdateOneRequiredWithoutCommodityNestedInput = {
    create?: XOR<accountsCreateWithoutCommodityInput, accountsUncheckedCreateWithoutCommodityInput>
    connectOrCreate?: accountsCreateOrConnectWithoutCommodityInput
    upsert?: accountsUpsertWithoutCommodityInput
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutCommodityInput, accountsUpdateWithoutCommodityInput>, accountsUncheckedUpdateWithoutCommodityInput>
  }

  export type item_stacksCreateNestedManyWithoutItemInput = {
    create?: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput> | item_stacksCreateWithoutItemInput[] | item_stacksUncheckedCreateWithoutItemInput[]
    connectOrCreate?: item_stacksCreateOrConnectWithoutItemInput | item_stacksCreateOrConnectWithoutItemInput[]
    createMany?: item_stacksCreateManyItemInputEnvelope
    connect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
  }

  export type inventory_categoriesCreateNestedOneWithoutItemsInput = {
    create?: XOR<inventory_categoriesCreateWithoutItemsInput, inventory_categoriesUncheckedCreateWithoutItemsInput>
    connectOrCreate?: inventory_categoriesCreateOrConnectWithoutItemsInput
    connect?: inventory_categoriesWhereUniqueInput
  }

  export type item_stacksUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput> | item_stacksCreateWithoutItemInput[] | item_stacksUncheckedCreateWithoutItemInput[]
    connectOrCreate?: item_stacksCreateOrConnectWithoutItemInput | item_stacksCreateOrConnectWithoutItemInput[]
    createMany?: item_stacksCreateManyItemInputEnvelope
    connect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
  }

  export type item_stacksUpdateManyWithoutItemNestedInput = {
    create?: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput> | item_stacksCreateWithoutItemInput[] | item_stacksUncheckedCreateWithoutItemInput[]
    connectOrCreate?: item_stacksCreateOrConnectWithoutItemInput | item_stacksCreateOrConnectWithoutItemInput[]
    upsert?: item_stacksUpsertWithWhereUniqueWithoutItemInput | item_stacksUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: item_stacksCreateManyItemInputEnvelope
    set?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    disconnect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    delete?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    connect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    update?: item_stacksUpdateWithWhereUniqueWithoutItemInput | item_stacksUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: item_stacksUpdateManyWithWhereWithoutItemInput | item_stacksUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: item_stacksScalarWhereInput | item_stacksScalarWhereInput[]
  }

  export type inventory_categoriesUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<inventory_categoriesCreateWithoutItemsInput, inventory_categoriesUncheckedCreateWithoutItemsInput>
    connectOrCreate?: inventory_categoriesCreateOrConnectWithoutItemsInput
    upsert?: inventory_categoriesUpsertWithoutItemsInput
    connect?: inventory_categoriesWhereUniqueInput
    update?: XOR<XOR<inventory_categoriesUpdateToOneWithWhereWithoutItemsInput, inventory_categoriesUpdateWithoutItemsInput>, inventory_categoriesUncheckedUpdateWithoutItemsInput>
  }

  export type item_stacksUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput> | item_stacksCreateWithoutItemInput[] | item_stacksUncheckedCreateWithoutItemInput[]
    connectOrCreate?: item_stacksCreateOrConnectWithoutItemInput | item_stacksCreateOrConnectWithoutItemInput[]
    upsert?: item_stacksUpsertWithWhereUniqueWithoutItemInput | item_stacksUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: item_stacksCreateManyItemInputEnvelope
    set?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    disconnect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    delete?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    connect?: item_stacksWhereUniqueInput | item_stacksWhereUniqueInput[]
    update?: item_stacksUpdateWithWhereUniqueWithoutItemInput | item_stacksUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: item_stacksUpdateManyWithWhereWithoutItemInput | item_stacksUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: item_stacksScalarWhereInput | item_stacksScalarWhereInput[]
  }

  export type inventory_itemsCreateNestedManyWithoutCategoryInput = {
    create?: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput> | inventory_itemsCreateWithoutCategoryInput[] | inventory_itemsUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutCategoryInput | inventory_itemsCreateOrConnectWithoutCategoryInput[]
    createMany?: inventory_itemsCreateManyCategoryInputEnvelope
    connect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
  }

  export type inventory_itemsUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput> | inventory_itemsCreateWithoutCategoryInput[] | inventory_itemsUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutCategoryInput | inventory_itemsCreateOrConnectWithoutCategoryInput[]
    createMany?: inventory_itemsCreateManyCategoryInputEnvelope
    connect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
  }

  export type inventory_itemsUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput> | inventory_itemsCreateWithoutCategoryInput[] | inventory_itemsUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutCategoryInput | inventory_itemsCreateOrConnectWithoutCategoryInput[]
    upsert?: inventory_itemsUpsertWithWhereUniqueWithoutCategoryInput | inventory_itemsUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: inventory_itemsCreateManyCategoryInputEnvelope
    set?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    disconnect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    delete?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    connect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    update?: inventory_itemsUpdateWithWhereUniqueWithoutCategoryInput | inventory_itemsUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: inventory_itemsUpdateManyWithWhereWithoutCategoryInput | inventory_itemsUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: inventory_itemsScalarWhereInput | inventory_itemsScalarWhereInput[]
  }

  export type inventory_itemsUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput> | inventory_itemsCreateWithoutCategoryInput[] | inventory_itemsUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutCategoryInput | inventory_itemsCreateOrConnectWithoutCategoryInput[]
    upsert?: inventory_itemsUpsertWithWhereUniqueWithoutCategoryInput | inventory_itemsUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: inventory_itemsCreateManyCategoryInputEnvelope
    set?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    disconnect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    delete?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    connect?: inventory_itemsWhereUniqueInput | inventory_itemsWhereUniqueInput[]
    update?: inventory_itemsUpdateWithWhereUniqueWithoutCategoryInput | inventory_itemsUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: inventory_itemsUpdateManyWithWhereWithoutCategoryInput | inventory_itemsUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: inventory_itemsScalarWhereInput | inventory_itemsScalarWhereInput[]
  }

  export type inventory_itemsCreateNestedOneWithoutItem_stacksInput = {
    create?: XOR<inventory_itemsCreateWithoutItem_stacksInput, inventory_itemsUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutItem_stacksInput
    connect?: inventory_itemsWhereUniqueInput
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

  export type inventory_itemsUpdateOneRequiredWithoutItem_stacksNestedInput = {
    create?: XOR<inventory_itemsCreateWithoutItem_stacksInput, inventory_itemsUncheckedCreateWithoutItem_stacksInput>
    connectOrCreate?: inventory_itemsCreateOrConnectWithoutItem_stacksInput
    upsert?: inventory_itemsUpsertWithoutItem_stacksInput
    connect?: inventory_itemsWhereUniqueInput
    update?: XOR<XOR<inventory_itemsUpdateToOneWithWhereWithoutItem_stacksInput, inventory_itemsUpdateWithoutItem_stacksInput>, inventory_itemsUncheckedUpdateWithoutItem_stacksInput>
  }

  export type seminar_participantsCreateNestedManyWithoutSeminarInput = {
    create?: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput> | seminar_participantsCreateWithoutSeminarInput[] | seminar_participantsUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutSeminarInput | seminar_participantsCreateOrConnectWithoutSeminarInput[]
    createMany?: seminar_participantsCreateManySeminarInputEnvelope
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
  }

  export type seminar_participantsUncheckedCreateNestedManyWithoutSeminarInput = {
    create?: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput> | seminar_participantsCreateWithoutSeminarInput[] | seminar_participantsUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutSeminarInput | seminar_participantsCreateOrConnectWithoutSeminarInput[]
    createMany?: seminar_participantsCreateManySeminarInputEnvelope
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
  }

  export type Enumseminar_statusFieldUpdateOperationsInput = {
    set?: $Enums.seminar_status
  }

  export type seminar_participantsUpdateManyWithoutSeminarNestedInput = {
    create?: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput> | seminar_participantsCreateWithoutSeminarInput[] | seminar_participantsUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutSeminarInput | seminar_participantsCreateOrConnectWithoutSeminarInput[]
    upsert?: seminar_participantsUpsertWithWhereUniqueWithoutSeminarInput | seminar_participantsUpsertWithWhereUniqueWithoutSeminarInput[]
    createMany?: seminar_participantsCreateManySeminarInputEnvelope
    set?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    disconnect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    delete?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    update?: seminar_participantsUpdateWithWhereUniqueWithoutSeminarInput | seminar_participantsUpdateWithWhereUniqueWithoutSeminarInput[]
    updateMany?: seminar_participantsUpdateManyWithWhereWithoutSeminarInput | seminar_participantsUpdateManyWithWhereWithoutSeminarInput[]
    deleteMany?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
  }

  export type seminar_participantsUncheckedUpdateManyWithoutSeminarNestedInput = {
    create?: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput> | seminar_participantsCreateWithoutSeminarInput[] | seminar_participantsUncheckedCreateWithoutSeminarInput[]
    connectOrCreate?: seminar_participantsCreateOrConnectWithoutSeminarInput | seminar_participantsCreateOrConnectWithoutSeminarInput[]
    upsert?: seminar_participantsUpsertWithWhereUniqueWithoutSeminarInput | seminar_participantsUpsertWithWhereUniqueWithoutSeminarInput[]
    createMany?: seminar_participantsCreateManySeminarInputEnvelope
    set?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    disconnect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    delete?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    connect?: seminar_participantsWhereUniqueInput | seminar_participantsWhereUniqueInput[]
    update?: seminar_participantsUpdateWithWhereUniqueWithoutSeminarInput | seminar_participantsUpdateWithWhereUniqueWithoutSeminarInput[]
    updateMany?: seminar_participantsUpdateManyWithWhereWithoutSeminarInput | seminar_participantsUpdateManyWithWhereWithoutSeminarInput[]
    deleteMany?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
  }

  export type seminarsCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<seminarsCreateWithoutParticipantsInput, seminarsUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: seminarsCreateOrConnectWithoutParticipantsInput
    connect?: seminarsWhereUniqueInput
  }

  export type accountsCreateNestedOneWithoutSeminarsInput = {
    create?: XOR<accountsCreateWithoutSeminarsInput, accountsUncheckedCreateWithoutSeminarsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutSeminarsInput
    connect?: accountsWhereUniqueInput
  }

  export type Enumparticipant_statusFieldUpdateOperationsInput = {
    set?: $Enums.participant_status
  }

  export type seminarsUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<seminarsCreateWithoutParticipantsInput, seminarsUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: seminarsCreateOrConnectWithoutParticipantsInput
    upsert?: seminarsUpsertWithoutParticipantsInput
    connect?: seminarsWhereUniqueInput
    update?: XOR<XOR<seminarsUpdateToOneWithWhereWithoutParticipantsInput, seminarsUpdateWithoutParticipantsInput>, seminarsUncheckedUpdateWithoutParticipantsInput>
  }

  export type accountsUpdateOneRequiredWithoutSeminarsNestedInput = {
    create?: XOR<accountsCreateWithoutSeminarsInput, accountsUncheckedCreateWithoutSeminarsInput>
    connectOrCreate?: accountsCreateOrConnectWithoutSeminarsInput
    upsert?: accountsUpsertWithoutSeminarsInput
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutSeminarsInput, accountsUpdateWithoutSeminarsInput>, accountsUncheckedUpdateWithoutSeminarsInput>
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

  export type accounts_commoditiesCreateWithoutAccountInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commodity: commoditiesCreateNestedOneWithoutAccountsInput
  }

  export type accounts_commoditiesUncheckedCreateWithoutAccountInput = {
    id?: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesCreateOrConnectWithoutAccountInput = {
    where: accounts_commoditiesWhereUniqueInput
    create: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput>
  }

  export type accounts_commoditiesCreateManyAccountInputEnvelope = {
    data: accounts_commoditiesCreateManyAccountInput | accounts_commoditiesCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type seminar_participantsCreateWithoutAccountInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    seminar: seminarsCreateNestedOneWithoutParticipantsInput
  }

  export type seminar_participantsUncheckedCreateWithoutAccountInput = {
    id?: string
    seminar_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsCreateOrConnectWithoutAccountInput = {
    where: seminar_participantsWhereUniqueInput
    create: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput>
  }

  export type seminar_participantsCreateManyAccountInputEnvelope = {
    data: seminar_participantsCreateManyAccountInput | seminar_participantsCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type accounts_commoditiesUpsertWithWhereUniqueWithoutAccountInput = {
    where: accounts_commoditiesWhereUniqueInput
    update: XOR<accounts_commoditiesUpdateWithoutAccountInput, accounts_commoditiesUncheckedUpdateWithoutAccountInput>
    create: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput>
  }

  export type accounts_commoditiesUpdateWithWhereUniqueWithoutAccountInput = {
    where: accounts_commoditiesWhereUniqueInput
    data: XOR<accounts_commoditiesUpdateWithoutAccountInput, accounts_commoditiesUncheckedUpdateWithoutAccountInput>
  }

  export type accounts_commoditiesUpdateManyWithWhereWithoutAccountInput = {
    where: accounts_commoditiesScalarWhereInput
    data: XOR<accounts_commoditiesUpdateManyMutationInput, accounts_commoditiesUncheckedUpdateManyWithoutAccountInput>
  }

  export type accounts_commoditiesScalarWhereInput = {
    AND?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
    OR?: accounts_commoditiesScalarWhereInput[]
    NOT?: accounts_commoditiesScalarWhereInput | accounts_commoditiesScalarWhereInput[]
    id?: StringFilter<"accounts_commodities"> | string
    account_id?: StringFilter<"accounts_commodities"> | string
    commodity_id?: StringFilter<"accounts_commodities"> | string
    createdAt?: DateTimeFilter<"accounts_commodities"> | Date | string
    updatedAt?: DateTimeFilter<"accounts_commodities"> | Date | string
  }

  export type seminar_participantsUpsertWithWhereUniqueWithoutAccountInput = {
    where: seminar_participantsWhereUniqueInput
    update: XOR<seminar_participantsUpdateWithoutAccountInput, seminar_participantsUncheckedUpdateWithoutAccountInput>
    create: XOR<seminar_participantsCreateWithoutAccountInput, seminar_participantsUncheckedCreateWithoutAccountInput>
  }

  export type seminar_participantsUpdateWithWhereUniqueWithoutAccountInput = {
    where: seminar_participantsWhereUniqueInput
    data: XOR<seminar_participantsUpdateWithoutAccountInput, seminar_participantsUncheckedUpdateWithoutAccountInput>
  }

  export type seminar_participantsUpdateManyWithWhereWithoutAccountInput = {
    where: seminar_participantsScalarWhereInput
    data: XOR<seminar_participantsUpdateManyMutationInput, seminar_participantsUncheckedUpdateManyWithoutAccountInput>
  }

  export type seminar_participantsScalarWhereInput = {
    AND?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
    OR?: seminar_participantsScalarWhereInput[]
    NOT?: seminar_participantsScalarWhereInput | seminar_participantsScalarWhereInput[]
    id?: StringFilter<"seminar_participants"> | string
    seminar_id?: StringFilter<"seminar_participants"> | string
    account_id?: StringFilter<"seminar_participants"> | string
    status?: Enumparticipant_statusFilter<"seminar_participants"> | $Enums.participant_status
    createdAt?: DateTimeFilter<"seminar_participants"> | Date | string
    updatedAt?: DateTimeFilter<"seminar_participants"> | Date | string
  }

  export type accounts_commoditiesCreateWithoutCommodityInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    account: accountsCreateNestedOneWithoutCommodityInput
  }

  export type accounts_commoditiesUncheckedCreateWithoutCommodityInput = {
    id?: string
    account_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesCreateOrConnectWithoutCommodityInput = {
    where: accounts_commoditiesWhereUniqueInput
    create: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput>
  }

  export type accounts_commoditiesCreateManyCommodityInputEnvelope = {
    data: accounts_commoditiesCreateManyCommodityInput | accounts_commoditiesCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type accounts_commoditiesUpsertWithWhereUniqueWithoutCommodityInput = {
    where: accounts_commoditiesWhereUniqueInput
    update: XOR<accounts_commoditiesUpdateWithoutCommodityInput, accounts_commoditiesUncheckedUpdateWithoutCommodityInput>
    create: XOR<accounts_commoditiesCreateWithoutCommodityInput, accounts_commoditiesUncheckedCreateWithoutCommodityInput>
  }

  export type accounts_commoditiesUpdateWithWhereUniqueWithoutCommodityInput = {
    where: accounts_commoditiesWhereUniqueInput
    data: XOR<accounts_commoditiesUpdateWithoutCommodityInput, accounts_commoditiesUncheckedUpdateWithoutCommodityInput>
  }

  export type accounts_commoditiesUpdateManyWithWhereWithoutCommodityInput = {
    where: accounts_commoditiesScalarWhereInput
    data: XOR<accounts_commoditiesUpdateManyMutationInput, accounts_commoditiesUncheckedUpdateManyWithoutCommodityInput>
  }

  export type commoditiesCreateWithoutAccountsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type commoditiesUncheckedCreateWithoutAccountsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type commoditiesCreateOrConnectWithoutAccountsInput = {
    where: commoditiesWhereUniqueInput
    create: XOR<commoditiesCreateWithoutAccountsInput, commoditiesUncheckedCreateWithoutAccountsInput>
  }

  export type accountsCreateWithoutCommodityInput = {
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
    seminars?: seminar_participantsCreateNestedManyWithoutAccountInput
  }

  export type accountsUncheckedCreateWithoutCommodityInput = {
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
    seminars?: seminar_participantsUncheckedCreateNestedManyWithoutAccountInput
  }

  export type accountsCreateOrConnectWithoutCommodityInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutCommodityInput, accountsUncheckedCreateWithoutCommodityInput>
  }

  export type commoditiesUpsertWithoutAccountsInput = {
    update: XOR<commoditiesUpdateWithoutAccountsInput, commoditiesUncheckedUpdateWithoutAccountsInput>
    create: XOR<commoditiesCreateWithoutAccountsInput, commoditiesUncheckedCreateWithoutAccountsInput>
    where?: commoditiesWhereInput
  }

  export type commoditiesUpdateToOneWithWhereWithoutAccountsInput = {
    where?: commoditiesWhereInput
    data: XOR<commoditiesUpdateWithoutAccountsInput, commoditiesUncheckedUpdateWithoutAccountsInput>
  }

  export type commoditiesUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type commoditiesUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountsUpsertWithoutCommodityInput = {
    update: XOR<accountsUpdateWithoutCommodityInput, accountsUncheckedUpdateWithoutCommodityInput>
    create: XOR<accountsCreateWithoutCommodityInput, accountsUncheckedCreateWithoutCommodityInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutCommodityInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutCommodityInput, accountsUncheckedUpdateWithoutCommodityInput>
  }

  export type accountsUpdateWithoutCommodityInput = {
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
    seminars?: seminar_participantsUpdateManyWithoutAccountNestedInput
  }

  export type accountsUncheckedUpdateWithoutCommodityInput = {
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
    seminars?: seminar_participantsUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type item_stacksCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type item_stacksUncheckedCreateWithoutItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type item_stacksCreateOrConnectWithoutItemInput = {
    where: item_stacksWhereUniqueInput
    create: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput>
  }

  export type item_stacksCreateManyItemInputEnvelope = {
    data: item_stacksCreateManyItemInput | item_stacksCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type inventory_categoriesCreateWithoutItemsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_categoriesUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    icon?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_categoriesCreateOrConnectWithoutItemsInput = {
    where: inventory_categoriesWhereUniqueInput
    create: XOR<inventory_categoriesCreateWithoutItemsInput, inventory_categoriesUncheckedCreateWithoutItemsInput>
  }

  export type item_stacksUpsertWithWhereUniqueWithoutItemInput = {
    where: item_stacksWhereUniqueInput
    update: XOR<item_stacksUpdateWithoutItemInput, item_stacksUncheckedUpdateWithoutItemInput>
    create: XOR<item_stacksCreateWithoutItemInput, item_stacksUncheckedCreateWithoutItemInput>
  }

  export type item_stacksUpdateWithWhereUniqueWithoutItemInput = {
    where: item_stacksWhereUniqueInput
    data: XOR<item_stacksUpdateWithoutItemInput, item_stacksUncheckedUpdateWithoutItemInput>
  }

  export type item_stacksUpdateManyWithWhereWithoutItemInput = {
    where: item_stacksScalarWhereInput
    data: XOR<item_stacksUpdateManyMutationInput, item_stacksUncheckedUpdateManyWithoutItemInput>
  }

  export type item_stacksScalarWhereInput = {
    AND?: item_stacksScalarWhereInput | item_stacksScalarWhereInput[]
    OR?: item_stacksScalarWhereInput[]
    NOT?: item_stacksScalarWhereInput | item_stacksScalarWhereInput[]
    id?: StringFilter<"item_stacks"> | string
    itemId?: StringFilter<"item_stacks"> | string
    quantity?: IntFilter<"item_stacks"> | number
    status?: Enumitem_statusFilter<"item_stacks"> | $Enums.item_status
    createdAt?: DateTimeFilter<"item_stacks"> | Date | string
    updatedAt?: DateTimeFilter<"item_stacks"> | Date | string
  }

  export type inventory_categoriesUpsertWithoutItemsInput = {
    update: XOR<inventory_categoriesUpdateWithoutItemsInput, inventory_categoriesUncheckedUpdateWithoutItemsInput>
    create: XOR<inventory_categoriesCreateWithoutItemsInput, inventory_categoriesUncheckedCreateWithoutItemsInput>
    where?: inventory_categoriesWhereInput
  }

  export type inventory_categoriesUpdateToOneWithWhereWithoutItemsInput = {
    where?: inventory_categoriesWhereInput
    data: XOR<inventory_categoriesUpdateWithoutItemsInput, inventory_categoriesUncheckedUpdateWithoutItemsInput>
  }

  export type inventory_categoriesUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_categoriesUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_itemsCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: item_stacksCreateNestedManyWithoutItemInput
  }

  export type inventory_itemsUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    item_stacks?: item_stacksUncheckedCreateNestedManyWithoutItemInput
  }

  export type inventory_itemsCreateOrConnectWithoutCategoryInput = {
    where: inventory_itemsWhereUniqueInput
    create: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput>
  }

  export type inventory_itemsCreateManyCategoryInputEnvelope = {
    data: inventory_itemsCreateManyCategoryInput | inventory_itemsCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type inventory_itemsUpsertWithWhereUniqueWithoutCategoryInput = {
    where: inventory_itemsWhereUniqueInput
    update: XOR<inventory_itemsUpdateWithoutCategoryInput, inventory_itemsUncheckedUpdateWithoutCategoryInput>
    create: XOR<inventory_itemsCreateWithoutCategoryInput, inventory_itemsUncheckedCreateWithoutCategoryInput>
  }

  export type inventory_itemsUpdateWithWhereUniqueWithoutCategoryInput = {
    where: inventory_itemsWhereUniqueInput
    data: XOR<inventory_itemsUpdateWithoutCategoryInput, inventory_itemsUncheckedUpdateWithoutCategoryInput>
  }

  export type inventory_itemsUpdateManyWithWhereWithoutCategoryInput = {
    where: inventory_itemsScalarWhereInput
    data: XOR<inventory_itemsUpdateManyMutationInput, inventory_itemsUncheckedUpdateManyWithoutCategoryInput>
  }

  export type inventory_itemsScalarWhereInput = {
    AND?: inventory_itemsScalarWhereInput | inventory_itemsScalarWhereInput[]
    OR?: inventory_itemsScalarWhereInput[]
    NOT?: inventory_itemsScalarWhereInput | inventory_itemsScalarWhereInput[]
    id?: StringFilter<"inventory_items"> | string
    name?: StringFilter<"inventory_items"> | string
    description?: StringNullableFilter<"inventory_items"> | string | null
    categoryId?: StringFilter<"inventory_items"> | string
    createdAt?: DateTimeFilter<"inventory_items"> | Date | string
    updatedAt?: DateTimeFilter<"inventory_items"> | Date | string
  }

  export type inventory_itemsCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: inventory_categoriesCreateNestedOneWithoutItemsInput
  }

  export type inventory_itemsUncheckedCreateWithoutItem_stacksInput = {
    id?: string
    name: string
    description?: string | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_itemsCreateOrConnectWithoutItem_stacksInput = {
    where: inventory_itemsWhereUniqueInput
    create: XOR<inventory_itemsCreateWithoutItem_stacksInput, inventory_itemsUncheckedCreateWithoutItem_stacksInput>
  }

  export type inventory_itemsUpsertWithoutItem_stacksInput = {
    update: XOR<inventory_itemsUpdateWithoutItem_stacksInput, inventory_itemsUncheckedUpdateWithoutItem_stacksInput>
    create: XOR<inventory_itemsCreateWithoutItem_stacksInput, inventory_itemsUncheckedCreateWithoutItem_stacksInput>
    where?: inventory_itemsWhereInput
  }

  export type inventory_itemsUpdateToOneWithWhereWithoutItem_stacksInput = {
    where?: inventory_itemsWhereInput
    data: XOR<inventory_itemsUpdateWithoutItem_stacksInput, inventory_itemsUncheckedUpdateWithoutItem_stacksInput>
  }

  export type inventory_itemsUpdateWithoutItem_stacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: inventory_categoriesUpdateOneRequiredWithoutItemsNestedInput
  }

  export type inventory_itemsUncheckedUpdateWithoutItem_stacksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsCreateWithoutSeminarInput = {
    id?: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
    account: accountsCreateNestedOneWithoutSeminarsInput
  }

  export type seminar_participantsUncheckedCreateWithoutSeminarInput = {
    id?: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsCreateOrConnectWithoutSeminarInput = {
    where: seminar_participantsWhereUniqueInput
    create: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput>
  }

  export type seminar_participantsCreateManySeminarInputEnvelope = {
    data: seminar_participantsCreateManySeminarInput | seminar_participantsCreateManySeminarInput[]
    skipDuplicates?: boolean
  }

  export type seminar_participantsUpsertWithWhereUniqueWithoutSeminarInput = {
    where: seminar_participantsWhereUniqueInput
    update: XOR<seminar_participantsUpdateWithoutSeminarInput, seminar_participantsUncheckedUpdateWithoutSeminarInput>
    create: XOR<seminar_participantsCreateWithoutSeminarInput, seminar_participantsUncheckedCreateWithoutSeminarInput>
  }

  export type seminar_participantsUpdateWithWhereUniqueWithoutSeminarInput = {
    where: seminar_participantsWhereUniqueInput
    data: XOR<seminar_participantsUpdateWithoutSeminarInput, seminar_participantsUncheckedUpdateWithoutSeminarInput>
  }

  export type seminar_participantsUpdateManyWithWhereWithoutSeminarInput = {
    where: seminar_participantsScalarWhereInput
    data: XOR<seminar_participantsUpdateManyMutationInput, seminar_participantsUncheckedUpdateManyWithoutSeminarInput>
  }

  export type seminarsCreateWithoutParticipantsInput = {
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

  export type seminarsUncheckedCreateWithoutParticipantsInput = {
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

  export type seminarsCreateOrConnectWithoutParticipantsInput = {
    where: seminarsWhereUniqueInput
    create: XOR<seminarsCreateWithoutParticipantsInput, seminarsUncheckedCreateWithoutParticipantsInput>
  }

  export type accountsCreateWithoutSeminarsInput = {
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
    commodity?: accounts_commoditiesCreateNestedManyWithoutAccountInput
  }

  export type accountsUncheckedCreateWithoutSeminarsInput = {
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
    commodity?: accounts_commoditiesUncheckedCreateNestedManyWithoutAccountInput
  }

  export type accountsCreateOrConnectWithoutSeminarsInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutSeminarsInput, accountsUncheckedCreateWithoutSeminarsInput>
  }

  export type seminarsUpsertWithoutParticipantsInput = {
    update: XOR<seminarsUpdateWithoutParticipantsInput, seminarsUncheckedUpdateWithoutParticipantsInput>
    create: XOR<seminarsCreateWithoutParticipantsInput, seminarsUncheckedCreateWithoutParticipantsInput>
    where?: seminarsWhereInput
  }

  export type seminarsUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: seminarsWhereInput
    data: XOR<seminarsUpdateWithoutParticipantsInput, seminarsUncheckedUpdateWithoutParticipantsInput>
  }

  export type seminarsUpdateWithoutParticipantsInput = {
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

  export type seminarsUncheckedUpdateWithoutParticipantsInput = {
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

  export type accountsUpsertWithoutSeminarsInput = {
    update: XOR<accountsUpdateWithoutSeminarsInput, accountsUncheckedUpdateWithoutSeminarsInput>
    create: XOR<accountsCreateWithoutSeminarsInput, accountsUncheckedCreateWithoutSeminarsInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutSeminarsInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutSeminarsInput, accountsUncheckedUpdateWithoutSeminarsInput>
  }

  export type accountsUpdateWithoutSeminarsInput = {
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
    commodity?: accounts_commoditiesUpdateManyWithoutAccountNestedInput
  }

  export type accountsUncheckedUpdateWithoutSeminarsInput = {
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
    commodity?: accounts_commoditiesUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type accounts_commoditiesCreateManyAccountInput = {
    id?: string
    commodity_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsCreateManyAccountInput = {
    id?: string
    seminar_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: commoditiesUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type accounts_commoditiesUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodity_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seminar?: seminarsUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type seminar_participantsUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    seminar_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesCreateManyCommodityInput = {
    id?: string
    account_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type accounts_commoditiesUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountsUpdateOneRequiredWithoutCommodityNestedInput
  }

  export type accounts_commoditiesUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accounts_commoditiesUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksCreateManyItemInput = {
    id?: string
    quantity?: number
    status?: $Enums.item_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type item_stacksUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type item_stacksUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    status?: Enumitem_statusFieldUpdateOperationsInput | $Enums.item_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type inventory_itemsCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type inventory_itemsUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: item_stacksUpdateManyWithoutItemNestedInput
  }

  export type inventory_itemsUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item_stacks?: item_stacksUncheckedUpdateManyWithoutItemNestedInput
  }

  export type inventory_itemsUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsCreateManySeminarInput = {
    id?: string
    account_id: string
    status?: $Enums.participant_status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type seminar_participantsUpdateWithoutSeminarInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountsUpdateOneRequiredWithoutSeminarsNestedInput
  }

  export type seminar_participantsUncheckedUpdateWithoutSeminarInput = {
    id?: StringFieldUpdateOperationsInput | string
    account_id?: StringFieldUpdateOperationsInput | string
    status?: Enumparticipant_statusFieldUpdateOperationsInput | $Enums.participant_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type seminar_participantsUncheckedUpdateManyWithoutSeminarInput = {
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