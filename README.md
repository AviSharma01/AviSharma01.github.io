# Ultimate Tic Tac Toe AI

The game can be played on <https://avisharma01.github.io/>

![Screenshot 2023-08-31 at 11 15 27 PM](https://github.com/AviSharma01/AviSharma01.github.io/assets/64145346/62ae6891-fed2-4bb8-b8fa-06676207ae5d)

The Ultimate Tic Tac Toe AI uses minimax, board evaluation, and alpha-beta pruning. The depth limit establishes how many steps the AI can foresee.

<b> NOTE: </b> Since the AI uses computational resources to explore the game, it is preferred to run it on your laptop rather than mobile devices.

## Instructions

Following the customary rules, the game commences with player X making a move in any available spot of their choosing. This action directs their opponent to the corresponding local board. For instance, if X places their marker in the lower-left section of their local board, O must then make their move within any of the nine positions on the local board situated at the lower left of the global board. With each move, X is directed to a distinct board. In adherence to the traditional tic-tac-toe regulations, when a move secures a win on a local board, that entire local board is designated as a victory for the respective player on the global board. When a local board is clinched by a player or becomes fully occupied, further moves are prohibited on that particular board. Should a move direct a player to such a board, they are free to make a move on any other local board. The conclusion of the game is reached when a player emerges triumphant on the global board or when no valid moves remain, resulting in a draw.

### Further Resources

The Alpha Zero Algorithm can be used to create the Ultimate Tic Tac Toe AI <https://web.stanford.edu/~surag/posts/alphazero.html>
