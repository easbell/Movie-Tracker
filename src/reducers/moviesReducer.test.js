import { moviesReducer } from './moviesReducer';
import * as actions from '../actions'
import { mockMovies } from '../utils/mockData'

describe('moviesReducer', () => {
  it('should return the initial state', () => {
    const expected = [];

    const result = moviesReducer(undefined, {})
    expect(result).toEqual(expected)
  });

  it('should return the state with a movies array', () => {
    const action = actions.addAllMovies(mockMovies)
    const initialState = []
    const expected = mockMovies

    const result = moviesReducer(initialState, action)
    expect(result).toEqual(expected)
  })
})