import test from 'node:test';
import assert from 'node:assert/strict';
import {createQuestion as tugQuestion, initialMatch,applyAnswer,DEFAULT_SETTINGS} from '../src/games/tug/lib/game.ts';
import {createQuestion as snakeQuestion,resolveMove,tilePosition} from '../src/games/snakes/lib/game.ts';
test('tira y afloja suma con acierto',()=>{
 const game=initialMatch(DEFAULT_SETTINGS);
 const value=game.questions[0].answer;
 const result=applyAnswer({...game,inputs:[value,'']},0,DEFAULT_SETTINGS);
 assert.equal(result.scores[0],1);assert.equal(result.progress,-1);
});
test('tira y afloja fallo no suma',()=>{
 const game=initialMatch(DEFAULT_SETTINGS);
 const result=applyAnswer({...game,inputs:['wrong','']},0,DEFAULT_SETTINGS);
 assert.equal(result.scores[0],0);
});
test('serpientes respuesta correcta avanza, error retrocede',()=>{
 assert.equal(resolveMove(20,4,true).landing,24);
 assert.equal(resolveMove(20,4,false).final,16);
 assert.equal(resolveMove(1,6,false).final,1);
 assert.equal(tilePosition(100).row,0);
 assert.equal(typeof snakeQuestion(['+'],1).answer,'number');
});
