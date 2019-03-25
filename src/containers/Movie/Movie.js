import React, {Component} from 'react';
import { fetchData } from '../../utils/fetch';
import { addFavorite, deleteFavorite } from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
       

export class Movie extends Component {
  constructor() {
    super()
    this.state = {
      favorite: false,
      message: ''
    }
  }

  componentDidMount = () => {
    const {favorites, id} = this.props
    favorites.forEach(favorite => {
      if(favorite === id) {
        this.setState({favorite: true})
      }
    })
  }

  validateFavorite = () => {
    const { user_id, id } = this.props  
    if(user_id) {
      if(this.props.favorites.includes(id)) {
        console.log('favorite already exists')
        this.removeFavorite()
        this.setState({favorite: false})
      } else {
        this.addFavorite()
        this.setState({favorite: true})
      }
    } else {
      console.log('log in')
    }
  }

  removeFavorite = async () => {
    const { id, user_id } = this.props
    const url = `http://localhost:3000/api/users/${user_id}/favorites/${id}`;
    const userOptionObject = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }
    await fetchData(url, userOptionObject);
    this.props.deleteFavorite(id)
  }

  addFavorite = async (e) => {
    const { id, title, rating, user_id, posterImage, synopsis, releaseDate } = this.props
    const url = "http://localhost:3000/api/users/favorites/new"
    const movie = {
      movie_id: id, 
      user_id: user_id, 
      title: title, 
      poster_path: posterImage, 
      release_date: releaseDate, 
      vote_average: rating, 
      overview: synopsis
    }
    try {
      const addedFavorite = await fetchData(url, {
        method: "POST", 
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(addedFavorite)
      this.props.addFavoriteToState(id)
    } catch(error) {
      console.log(error.message)
    }
  }

  render() {
    const {favorite} = this.state
    console.log(favorite)
    const { id, title, rating, posterImage, synopsis } = this.props
    const image = 'https://image.tmdb.org/t/p/w500'+ posterImage
    return (
      <div className="movie">
        <div className="movie-info">
        {title}
        {rating}
        {synopsis}
        </div>
        {/* <h4 className="movie-title">{title}</h4> */}
        {/* <p classsName="rating">{rating}</p> */}
        <Link to={`/movies/${id}`} >
          <img src={image} alt='movie poster'/> 
        </Link>
        <div onClick={this.validateFavorite} className={favorite ? 'fav-true': 'fav-false'}></div>
      </div>
    )
  }
}

export const mapStateToProps = (state) => ({
  user_id: state.user.id,
  favorites: state.favorites
})

export const mapDispatchToProps = (dispatch) => ({
  addFavoriteToState: (favorite) => dispatch(addFavorite(favorite)),
  deleteFavorite: (favorite) => dispatch(deleteFavorite(favorite))
})

export default connect(mapStateToProps, mapDispatchToProps)(Movie)