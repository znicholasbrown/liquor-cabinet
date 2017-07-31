import React, { Component } from 'react';
import './App.css';
import { Button, Chip, Modal, Collapsible, CollapsibleItem, Input, Icon } from 'react-materialize';

//window.localStorage.clear("_user_");
class App extends Component {
  constructor(props) {
    super(props);

    this.state = { _user_: JSON.parse(localStorage.getItem("_user_")) || "" };
  }
  render() {
    return (
      <div className="app">
        <BackgroundImage/>
        <div className="welcome-header">
          <h2>Welcome <User _user_={ this.state._user_ }/>!</h2>
                  </div>
        <div className="app-content">
          <NewRecipe _user_={ this.state._user_ }/>
        </div>
        <div className="copyright">
          <p>
            &#169;2017&nbsp;
             <a href="https://znicholasbrown.github.io" rel="noopener noreferrer" target="_blank">Z Nicholas Brown</a>
          </p>
          <p>
            Background photo by <a href="https://unsplash.com/@maiaeli" rel="noopener noreferrer" target="_blank">Maia Eli</a>
          </p>
        </div>
      </div>
    );
  }
}
class BackgroundImage extends Component {
  render() {
    return(
      <div className="background-img"></div>
    )
  }
}
class User extends Component {
  constructor(props) {
    super(props);

    this.state = { _user_: "", recipeBook: JSON.parse(localStorage.getItem(this.props._user_ + "recipeBook")) };
  }
  handleUserChange = (e) => {
    var value = e.target.value;
    this.setState({ _user_: value }, this.commitUserChange)

  }
  commitUserChange = () => {
    localStorage.setItem("_user_", JSON.stringify(this.state._user_));
    localStorage.setItem(this.state._user_ + "recipeBook", JSON.stringify(this.state.recipeBook));
  }
  render () {

      return (
        <input autoComplete="off" defaultValue={ (this.props._user_ == null ? "" : this.props._user_) } type="text" id="_user_" onChange={ this.handleUserChange }></input>
      )}
}

class NewRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = { name: "", ingredients: "", recipeBook: JSON.parse(localStorage.getItem(this.props._user_+"recipeBook")) || [{name: "Screwdriver", ingredients: ["orange juice", "vodka"]}, {name: "Mojito", ingredients: ["simple syrup", "mint leaves", "soda water", "white rum"]}, {name: "Old Fashioned", ingredients: ["rye whiskey", "bitters", "orange peel", "cherry"]}, {name: "Gin & Tonic", ingredients: ["gin", "tonic water", "lime", "cherry"]}, {name: "Tequila Sunrise", ingredients: ["tequila", "orange juice", "grenadine"]}]};
  }
  handleNameChange = (e) => {
    this.setState({ name: e.target.value })
  }
  handleIngredientsChange = (e) => {
    this.setState({ ingredients: e.target.value })
  }
  addToRecipeBook = () => {
    const ingredientsArr = (this.state.ingredients).split(",");
    const thisRecipe = { name: this.state.name, ingredients: ingredientsArr };
    this.state.recipeBook.push(thisRecipe);
    this.setState({ name: "" })
    this.setState({ ingredients: "" })
    localStorage.setItem(this.props._user_+"recipeBook", JSON.stringify(this.state.recipeBook));
  }
  render() {

    return (
      <div>
        <RecipeData _user_={ this.props._user_ } recipeBook={ this.state.recipeBook }/>
        <Modal trigger={<Button floating large icon="add" className="new-recipe-button green" waves="purple"/>} header="New Recipe">
            <Input autoComplete="off" label="Name" type="text" id="name" value={ this.state.name } onChange={ this.handleNameChange }><Icon>local_bar</Icon></Input>
            <div>Ingredients, separated by commas:</div>
            <Input autoComplete="off" label="Ingredients" type="text" id="ingredients" value={ this.state.ingredients } onChange={ this.handleIngredientsChange }><Icon>local_drink</Icon></Input>
            <Button waves="purple" className="add-recipe-button modal-close green" onClick={ this.addToRecipeBook }>Add</Button>
        </Modal>
      </div>
    )
  }
}

class RecipeData extends Component {
  constructor(props) {
    super(props);

    this.state = { name: undefined, ingredients: undefined, recipeBook: this.props.recipeBook };
  }
  handleNameChange = (e) => {
    this.setState({ name: e.target.value })
  }
  handleIngredientsChange = (e) => {
    this.setState({ ingredients: e.target.value })
  }
  editRecipeBook = (e) => {
    var index = undefined;

    for (var i=0; i < this.state.recipeBook.length; i++) {
      if (this.state.recipeBook[i].name === e.target.value) {
        index = i;
      }
    }
    const ingredientsArr = this.state.ingredients ? this.state.ingredients.split(",") : undefined;
    const thisRecipe = { name: this.state.name === undefined ? e.target.value : this.state.name, ingredients: ingredientsArr === undefined ? this.state.recipeBook[index].ingredients : ingredientsArr };
    this.state.recipeBook.splice(index, 1);
    this.state.recipeBook.push(thisRecipe);
    this.setState({ name: undefined })
    this.setState({ ingredients: undefined })
    localStorage.setItem(this.props._user_+"recipeBook", JSON.stringify(this.state.recipeBook));

  }
  deleteRecipe = (e) => {
    var index = undefined;

    for (var i=0; i < this.state.recipeBook.length; i++) {
      if (this.state.recipeBook[i].name === e.target.value) {
        index = i;
      }
    }
    this.setState({ name: undefined })
    this.setState({ ingredients: undefined })
    this.state.recipeBook.splice(index, 1);
    localStorage.setItem(this.props._user_+"recipeBook", JSON.stringify(this.state.recipeBook));
  }
  render() {

    const recipes = this.props.recipeBook.map((recipe, i) => {
      const ingredients = recipe.ingredients.map((ingredient, k) => {
        return (
          <Chip close={false} key={ingredient}>{ingredient}</Chip>
        )});
      return (
        <CollapsibleItem key={i} header={recipe.name} icon="local_bar" className="recipe">

          <div className="ingredients">
          {ingredients}
            <Modal
              trigger={<Button floating waves="purple" icon="edit" className="edit-recipe darken-1"/>}
              header={ recipe.name + " Recipe"}>
                <Input
                  autoComplete="off"
                  label="Name"
                  type="text"
                  id="name"
                  defaultValue={ this.state.name || recipe.name }
                  onChange={ this.handleNameChange }>
                   <Icon>local_bar</Icon>
                 </Input>
                <Input
                  autoComplete="off"
                  label="Ingredients"
                  type="text"
                  id="ingredients"
                  defaultValue={ this.state.name || recipe.ingredients.join(", ") }
                  onChange={ this.handleIngredientsChange }>
                  <Icon>local_drink</Icon>
                </Input>
                <Button waves="yellow" value={ recipe.name } className="add-recipe-button modal-close" onClick={ this.editRecipeBook }>Done</Button>
            </Modal>
            <Modal
              trigger={<Button floating waves="yellow" icon="delete" className="delete-recipe red"/>}
              header={ "Delete " + recipe.name + " Recipe?"}>
              <Button waves="yellow" value={ recipe.name } className="add-recipe-button modal-close red" onClick={ this.deleteRecipe }>Delete</Button>
            </Modal>
          </div>
        </CollapsibleItem>
      )});
    return (
      <div>
        <Collapsible className="recipe-book">{recipes}</Collapsible>
      </div>
    )
  }
}


export default App;
