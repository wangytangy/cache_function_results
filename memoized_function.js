Function.prototype.memoized = function() {
  // 'this' refers to the function that is calling 'makeMemoizable'

  // values for caching results
  // _.values is stored in the function instance
  this._values = this._values || {};

  // stringify function's arguments to make a key
  let key = JSON.stringify(Array.from(arguments));

  // check if result is cached
  if (this._values[key] !== undefined) {
    console.log('Cache accessed');
    return this._values[key]

  // call the original function if result is not cached
  // also store the result
  } else {
    // calls the function with apply();
    // passing in itself as context and all arguments
    let returnValue = JSON.stringify(this.apply(this, arguments));

    // store result of the function call
    this._values[key] = returnValue;

    // return result;
    return returnValue;
  }
}

Function.prototype.makeMemoizable = function() {
  // save 'this' context
  let fn = this;
  // 'this' refers to the function that is calling 'makeMemoizable' (i.e. nPrimes)
  console.log(`function is now memoized`);

  // returns a new version of the function that makes use of memo
  return function() {
    return fn.memoized.apply(fn, arguments);
    // the 'memoized' function is being called ON 'fn'...
    // ... so 'this' in the 'memoized' function refers to 'fn' (i.e. nPrimes)
  }
};

//***************************** TEST ********************************//


function isPrime(num) {
  let prime = (num > 1) //false if num === 1
  let max = Math.floor(num / 2);

  for (var i = 2; i < max ; i++) {
    if (num % i === 0) {
      prime = false;
      break;
    }
  }
  return prime;
}

function nPrimes(n) {
  const primes = [2];

  let i = 3;
  while (primes.length < n) {
    if (isPrime(i)) primes.push(i);
    i += 2;
  }
  return primes;
}

function timer(func) {
  console.time("function runtime");
  func();
  console.timeEnd("function runtime");
}


let memoizedNPrimes = (nPrimes).makeMemoizable();

//first call should take a long time...
timer(() => memoizedNPrimes(100000));

//second call should access cached results and be much faster
timer(() => memoizedNPrimes(100000));
