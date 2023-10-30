"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Recipe = function () {
  var host = 'localhost';
  var recipe = [];
  var substitutionArray = [];
  var NUT_BUTTER = ["peanut butter", "almond butter", "hazelnut butter", "coconut butter", "nut butter", "cookie butter"];
  var restrictionList = [];
  var ingredientSubstitutions = {
    substitutionOptions: []
  };
  var restrictedIngredientCount = 0;

  var searchRecipe = function searchRecipe() {
    var searchParam = document.getElementById("search-input").value;
    var recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    try {
      fetch("http://" + host + ":8080/api/v1/search-simply-recipes/" + searchParam, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (resp) {
        return resp.json();
      }).then(function (results) {
        results.forEach(function (data) {
          var recipeName = document.createElement('li');
          var link = document.createElement('a'); //link.href = data.link; //--> this makes it redirect to the actual page of the webiste so we don't need it
          //But perhaps we'll keep it for now so that the user can go see the original recipe if they want

          link.textContent = data.title;

          link.onclick = function () {
            return showRecipe(data.link);
          };

          recipeName.appendChild(link);
          recipeList.appendChild(recipeName);
        });
      });
    } catch (e) {
      console.log(e);
    }

    return false;
  };

  function showRecipe(link) {
    var recipeTitleHeader, ingredientsHeader, ingredientList, directionsHeader, directionsList, restriction;
    return regeneratorRuntime.async(function showRecipe$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //HTML stuff - clear it before anything happens (user might have clicked multiple recipes so need it to refresh)
            recipeTitleHeader = document.getElementById('recipe-name'); //Title of the recipe 

            ingredientsHeader = document.getElementById('ingredients'); //Name: ingredients

            ingredientList = document.getElementById('ingredient-list'); //List of ingredients

            directionsHeader = document.getElementById('directions'); //Name: directions

            directionsList = document.getElementById('directions-list'); //List of directions

            restriction = document.getElementById('restriction-input').value; //restriction

            recipeTitleHeader.innerHTML = '';
            ingredientsHeader.innerHTML = '';
            ingredientList.innerHTML = '';
            directionsHeader.innerHTML = '';
            directionsList.innerHTML = ''; //Endpoint works and returns json array of recipe

            try {
              fetch("http://" + host + ":8080/api/v1/scrape-recipe/?recipeLink=" + link, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }).then(function (resp) {
                return resp.json();
              }).then(function _callee(results) {
                var updatedRecipe;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        //Setting up headers (need to do this here so it doesn't appear before the user selects a recipe)
                        recipeTitleHeader.innerHTML = results.title;
                        ingredientsHeader.innerHTML = 'Ingredients';
                        directionsHeader.innerHTML = 'Directions';
                        recipe = results; //Actual data

                        _context.next = 6;
                        return regeneratorRuntime.awrap(parseResults(results, restriction));

                      case 6:
                        updatedRecipe = _context.sent;
                        ingredientList.innerHTML = '<ul>' + updatedRecipe.ingredientList.map(function (item) {
                          return "<li>".concat(item, "</li>");
                        }).join('') + '</ul>';
                        directionsList.innerHTML = '<ul>' + updatedRecipe.directions.map(function (item) {
                          return "<li>".concat(item, "</li>");
                        }).join('') + '</ul>';

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });
            } catch (e) {
              console.log(e);
            } //REDIRECT USER TO DIFFERENT PAGE
            //window.location.href = link;


            return _context2.abrupt("return", false);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    });
  } //Gets restricted ingredients from db based on user's inputted restriction
  //Parameter is full recipe


  function parseResults(ingredientResults, restriction) {
    var ingredientNames, updatedRecipe, response, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, data, restrictedIngredients, badIngredients, handleDifferently;

    return regeneratorRuntime.async(function parseResults$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("parsing results");
            _context3.prev = 1;
            ingredientNames = ingredientResults.ingredientNames;
            updatedRecipe = [];
            restrictionList.push(restriction);
            _context3.next = 7;
            return regeneratorRuntime.awrap(fetch("http://" + host + ":8080/api/v1/restrictions", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }));

          case 7:
            response = _context3.sent;
            _context3.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            results = _context3.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 14;
            _iterator = results[Symbol.iterator]();

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 36;
              break;
            }

            data = _step.value;

            if (!(data.name === restriction)) {
              _context3.next = 33;
              break;
            }

            restrictedIngredients = data.tags;
            console.log("found", data.name);
            console.log("original recipe: ", ingredientResults);
            badIngredients = getRestrictedIngredientsInRecipe(ingredientNames, restrictedIngredients);
            console.log("Back to parseResults() --> restricted ingredients list = ", badIngredients);
            console.log("we are good until here back in parseResults() i think.");
            console.log("now filling the substitution array in getSubstitutionsForRecipe()");
            _context3.next = 28;
            return regeneratorRuntime.awrap(getSubstitutionsForRecipe(badIngredients));

          case 28:
            console.log('Substitutions:', ingredientSubstitutions);
            handleDifferently = true;
            recipe.ingredientNames = getUpdatedIngredientNames(recipe.ingredientNames, handleDifferently);
            recipe.ingredientList = getUpdatedIngredientNames(recipe.ingredientList, !handleDifferently);
            recipe.directions = getUpdatedIngredientNames(recipe.directions, !handleDifferently);

          case 33:
            _iteratorNormalCompletion = true;
            _context3.next = 16;
            break;

          case 36:
            _context3.next = 42;
            break;

          case 38:
            _context3.prev = 38;
            _context3.t0 = _context3["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 42:
            _context3.prev = 42;
            _context3.prev = 43;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 45:
            _context3.prev = 45;

            if (!_didIteratorError) {
              _context3.next = 48;
              break;
            }

            throw _iteratorError;

          case 48:
            return _context3.finish(45);

          case 49:
            return _context3.finish(42);

          case 50:
            console.log('--Ingredient names', recipe.ingredientNames);
            console.log('--Ingredient list', recipe.ingredientList);
            console.log('--Recipe Directions', recipe.directions);
            updatedRecipe = recipe;
            console.log("UPDATED RECIPE", updatedRecipe);
            return _context3.abrupt("return", updatedRecipe);

          case 58:
            _context3.prev = 58;
            _context3.t1 = _context3["catch"](1);
            console.log(_context3.t1);

          case 61:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 58], [14, 38, 42, 50], [43,, 45, 49]]);
  } //Finds and returns ingredients in the recipe that are restricted


  function getRestrictedIngredientsInRecipe(ingredientsOfRecipe, ingredientsRestrictedForUser) {
    console.log("recipe ingredients", ingredientsOfRecipe);
    console.log("restricted ingredients for this user ", ingredientsRestrictedForUser);
    var badIngredientsInRecipe = [];

    for (var i = 0; i < ingredientsOfRecipe.length; i++) {
      var ingredientOfRecipe = ingredientsOfRecipe[i];
      var addBadIngredient = handleEdgeCaseBadIngredients(ingredientOfRecipe, ingredientsRestrictedForUser);

      if (addBadIngredient) {
        badIngredientsInRecipe.push(ingredientOfRecipe);
      }
    }

    return badIngredientsInRecipe;
  } //Handles cases of ingredients that should or should not be added to badIngredients list
  //Currently only handles the nut butter issue but will be expanded


  function handleEdgeCaseBadIngredients(ingredientOfRecipe, ingredientsRestrictedForUser) {
    //Checks if a portion of the recipe ingredient string is included in ingredientsRestrictedForUser
    if (ingredientsRestrictedForUser.some(function (restrictedIngredient) {
      return ingredientOfRecipe.includes(restrictedIngredient);
    })) {
      //Checks if the string includes the word "butter" and is not referring to dairy butter (need to abstract this somehow)
      if (!NUT_BUTTER.some(function (nutButter) {
        return ingredientOfRecipe.toLowerCase().includes(nutButter);
      })) {
        console.log("-- added " + ingredientOfRecipe + " to restricted ingredients ");
        return true;
      }
    }

    return false;
  } //Params are original ingredients and identified bad ingredients


  function getSubstitutionsForRecipe(badIngredients) {
    var response, results;
    return regeneratorRuntime.async(function getSubstitutionsForRecipe$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(fetch("http://" + host + ":8080/api/v1/ingredients", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }));

          case 3:
            response = _context4.sent;
            _context4.next = 6;
            return regeneratorRuntime.awrap(response.json());

          case 6:
            results = _context4.sent;
            //Iterate through ingredient db: match a badIngredients array element with a substitution from the database
            results.forEach(function (ingredientDB) {
              //Matches each badIngredient element with an ingriedient in the ingredients database
              if (badIngredients.some(function (badIngredient) {
                return badIngredient.toLowerCase().includes(ingredientDB.name.toLowerCase());
              })) {
                console.log("found bad ingredient: " + " matching db ingredient: " + ingredientDB.name);
                var alternativesList = [];
                var alternatives = ingredientDB.tags[0].alternatives;
                alternativesList.push.apply(alternativesList, _toConsumableArray(alternatives));
                console.log("alternatives to this ingredient: ", alternativesList);
                ingredientSubstitutions.substitutionOptions.push({
                  original: ingredientDB.name,
                  substitutions: alternatives
                });
                restrictedIngredientCount++;
              }
            });
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  } //Changes every instance of a restricted ingredient to an alternative ingredient in the various recipe lists
  //Parameter is a list of the recipe (ex: ingredientNames)


  function getUpdatedIngredientNames(list, handleDifferently) {
    console.log("getUpdated recipe called for " + list);
    list.forEach(function (line, lineIndex) {
      line = line.toLowerCase();
      console.log("line = " + line);

      for (var i = 0; i < restrictedIngredientCount; i++) {
        var originalIngredient = ingredientSubstitutions.substitutionOptions[i].original; // Check if the line contains the original ingredient

        if (line.toLowerCase().includes(originalIngredient)) {
          console.log("*FOUND " + originalIngredient + " in the original recipe");
          var substitutedIngredient = ingredientSubstitutions.substitutionOptions[i].substitutions[0];
          console.log("substitution for " + originalIngredient + " = " + substitutedIngredient);
          var quantity = line.split(' ')[0];
          console.log("quantity = " + quantity); //Replace restricted ingredient with substitution

          line = line.replace(new RegExp(originalIngredient, 'gi'), substitutedIngredient);
          console.log("NEW LINE WITH SUBS: " + line);
        }
      } // Update the line in the list


      list[lineIndex] = line;
    });
    console.log("*** new list *** " + list); //console.log('----------new', recipe);

    return list;
  }

  return {
    searchRecipe: searchRecipe
  };
}();