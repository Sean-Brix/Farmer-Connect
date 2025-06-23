
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

}

export type client_profile = $Enums.client_profile

export const client_profile: typeof $Enums.client_profile

export type access = $Enums.access

export const access: typeof $Enums.access

export type gender = $Enums.gender

export const gender: typeof $Enums.gender

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
    accounts_commodities: 'accounts_commodities'
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
      modelProps: "accounts" | "commodities" | "accounts_commodities"
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
  }

  export type AccountsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | AccountsCountOutputTypeCountCommodityArgs
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
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts"
    objects: {
      commodity: Prisma.$accounts_commoditiesPayload<ExtArgs>[]
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type accounts_commoditiesOrderByRelationAggregateInput = {
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

  export type accounts_commoditiesCreateNestedManyWithoutAccountInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
  }

  export type accounts_commoditiesUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<accounts_commoditiesCreateWithoutAccountInput, accounts_commoditiesUncheckedCreateWithoutAccountInput> | accounts_commoditiesCreateWithoutAccountInput[] | accounts_commoditiesUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: accounts_commoditiesCreateOrConnectWithoutAccountInput | accounts_commoditiesCreateOrConnectWithoutAccountInput[]
    createMany?: accounts_commoditiesCreateManyAccountInputEnvelope
    connect?: accounts_commoditiesWhereUniqueInput | accounts_commoditiesWhereUniqueInput[]
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
  }

  export type accounts_commoditiesCreateManyAccountInput = {
    id?: string
    commodity_id: string
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