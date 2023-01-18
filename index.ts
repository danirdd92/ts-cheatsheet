/*******************************
 * Type Annotations & Inference
 *******************************/

// Types can be annotated during variable declaration...
let someStr: string = "I'm a string";
someStr = 'still a string';
someStr = 5; /* ERROR, Type 'number' is not assignable to type 'string'. will not compile */

// Or be infered from the value
let someNum = 4;
//   ^?
let someBool = true;
//   ^?

// use "any" to get outside of ts constraints
let shouldNotDoThis: any = "Don't use me, I'm unsafe, you might get STD, there are better ways!";
shouldNotDoThis = 5;
shouldNotDoThis = false;

/************
 * Functions
 ************/

// parameter and return type annotations
function foo(str: string): string {
  return str.length > 0 ? 'foo' : 'bar';
}

// return type can also be infered
function addOne(num: number) {
  //        ^?
  return num + 1;
}

// functions without return statements return void
function bar() {
  //        ^?
  console.log('Some action');
}

// default parameter values
function terminateEarth(num1: number, num2: number = 0) {
  return num1 / num2;
}

/********************
 * Objects and Arrays
 ********************
 * Annotation and inference rules apply to Objects and Arrays
 */

// type of object is infered on declaration
const someObj = {
  //   ^?
  name: 'Bob',
  age: 12,
  isAdult: false,
};

const numbersThatAreNotTwo: number[] = [1, 3, 4, 5];

const characters = ['x', 'b', 'c'];
//    ^?
const multidimArray: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

/***********
 * Tuples
 * *********
 * typed, readonly, fixed sized array of various types.
 * a TS concept, doesn't exist in js.
 */
const tuple = ['NotFound', 404] as const;
//    ^?
/***********
 * Enums
 * *********
 * DONT USE TS ENUMS.
 */

/**************
 * Union Types
 **************
 * when greater flexability is needed on a property/ parameter/ return type
 * you can use a Union type declared as Type1 | Type2 | Type3....
 * When using union types you'll have safe access only to shared properties
 * need to perform type narrowing* by checks to make sure what is the type and act accordingly
 */

function getUTCDateString(date: Date | string): string {
  const _ = date.toUTCString(); // string does not contain toUTCString() thus error
  //           ^?
  if (typeof date === 'string') {
    return new Date(date).toUTCString();
    //                ^?
  }
  // typescript knows date can only be string or Date, if we exhusted string above and returned
  // date can only be of Date type after the if check

  return date.toUTCString();
  //     ^?
}

/********************************
 * Type and Interface declaration
 ********************************
 * type declaration and interface are the same for the most part
 * with few key differences, for 99% percent of the time you can choose either one you like.
 */

// property values during type declaration can be either types or concrete values
interface Dog {
  name: string;
  age: number;
  breed: string;
  legs: 4;
}

const doggo: Dog = {
  name: 'Hercules',
  age: 5,
  breed: 'Chihuahua',
  legs: 4,
};

// by deafault every property is required to qualify as a certain type.
// for optional properties use ? suffix or a union with undefined
type Person = {
  name: string;
  age: number;
  isCoding: boolean;
  dogs?: Dog[];
  legs: number | undefined;
};

// only types can use union syntax
type FoodSource = 'grain' | 'dairy' | 'meat' | 'fruits and vegatables';
type PersonOrFood = Person | FoodSource;

// types can be intersected into new types
type Pet = Dog & { owner: Person };

// properties can also be functions
interface IsDog {
  bark: () => void;
  befriend: (dog: Dog) => void;
  eat(): void;
  procreate(dog: Dog): Dog;
}

// * interfaces can be extended like classes and also extend themselves by re-declaring themselves.
// * interface/ type declarations are hoisted and because of this
//   turning off the comments will break doggo as type of Dog

// interface Dog extends IsDog {
//   hasOwner?: boolean;
// }
// doggo.bark();
// console.log(doggo?.hasOwner);

/*********
 * Classes
 *********
 */

class BasicJSClass {
  prop: string | number | undefined;
  #privateProp: boolean;

  constructor(prop: string | number | undefined, privateProp: boolean) {
    this.prop = prop;
    this.#privateProp = privateProp;
  }

  fn() {
    console.log('class instance func fired');
  }

  get getSecretInternalValue() {
    return this.#privateProp;
  }
  set assignProp(value: string | number | undefined) {
    this.prop = value;
  }
}

class TSWithASpoonOfSugar {
  constructor(public prop: string, private privateProp: boolean) {}

  printProp() {
    return this.prop;
  }

  get privateValue() {
    return this.privateProp;
  }
}

/***********
 * Generics
 * *********
 * type safe, flexible or futureproof; pick three
 */

type CloneWars<T> = {
  me: T;
  clones: T[];
};

const genericArrowFunc = <T>(param: T) => {
  console.log('param is: ', param);
};

function mergeObjects<T, U>(obj1: T, obj2: U) {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    throw new Error('This should be accounted for!');
  }
  return {
    ...obj1,
    ...obj2,
  };
}

// constraints - T and U must at least be a valid object
function mergeObjectsFixed<T extends object, U extends object>(obj1: T, obj2: U) {
  return {
    ...obj1,
    ...obj2,
  };
}

// default type parametes
function makeTypedList<T = number>(): T[] {
  return [];
}

const definitlyNumArray = makeTypedList();
//      ^?
const arrayOfStrings = makeTypedList<string>();
//      ^?

/*****************
 * Type Narrowing
 * ***************
 */

// when working with primitive types -> use typeof
function double(value: number | string) {
  if (typeof value === 'number') {
    return value * 2;
    //        ^?
  }
  return value.repeat(2);
  //        ^?
}

// when working with null or undefined
function printText(text: string | null, optional?: string) {
  if (!text) {
    console.log('no text to print');
  } else {
    console.log(text);
    //          ^?
  }

  if (optional) console.log(optional);
}

// when working with classes
function getUTCDateStringV2(date: Date | string): string {
  const _ = date.toUTCString(); // string does not contain toUTCString() thus error
  //           ^?
  if (date instanceof Date) {
    return date.toUTCString();
    //       ^?
  }

  return new Date(date).toUTCString();
  //                ^?
}

// when working w/ unions with shared properties
type X = {
  shared: boolean;
  dog: Dog;
};

type Y = {
  shared: boolean;
  cat: never;
};

function getLovedOne(input: X | Y): Dog | never {
  const _ = input.dog; // dog is only on X need to narrow

  if ('dog' in input) {
    return input.dog;
    //      ^?
  }

  return input.cat;
  //      ^?
}

/****************************
 * BONUS FOR MARVEL FANS
 ****************************
 */

const normalPeople: Person[] = [];
const peopleInDrStrange: Person[][][] = [];
