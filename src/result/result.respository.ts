import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultRepository extends Repository<Result> {
  constructor(private readonly dataSource: DataSource) {
    super(Result, dataSource.createEntityManager());
  }

  async getUserResultsWithStats(
    chatId: bigint,
    startOfWeek: Date,
    endOfWeek: Date,
  ) {
    const query = `
        WITH filtered_question_chat AS (
          SELECT DISTINCT
            question_chat.chat_id,
            question_chat.created_at
          FROM question_chat
          JOIN chat ON chat.id = question_chat.chat_id
          WHERE 
            chat.chat_id = $1
            AND question_chat.created_at BETWEEN $2 AND $3
        ),
        filtered_results AS (
          SELECT DISTINCT
            result.id AS result_id,
            result.is_correct,
            result.user_id
          FROM 
            result
          JOIN filtered_question_chat 
            ON filtered_question_chat.chat_id = result.chat_id
        ),
        filtered_users AS (
          SELECT DISTINCT
            user_chat.user_id
          FROM 
            user_chat
          JOIN chat ON chat.id = user_chat.chat_id
          WHERE 
            chat.chat_id = $1
        )
        SELECT 
          "user".id AS user_id,
          "user".name,
          "user".username,
          "user".streak,
          COUNT(CASE WHEN filtered_results.is_correct = true THEN 1 END) AS correctAnswers,
          COUNT(CASE WHEN filtered_results.is_correct = false THEN 1 END) AS incorrectAnswers
        FROM 
          "user"
        LEFT JOIN filtered_results ON filtered_results.user_id = "user".id
        WHERE 
          "user".id IN (SELECT user_id FROM filtered_users)
        GROUP BY 
          "user".id, "user".name, "user".username, "user".streak
        ORDER BY correctAnswers DESC;    
    `;

    return await this.query(query, [chatId, startOfWeek, endOfWeek]);
  }

  async getUsersWithMostCorrectAnswers(
    chatId: bigint,
    startOfWeek: Date,
    endOfWeek: Date,
  ) {
    const query = `
      WITH filtered_question_chat AS (
        SELECT DISTINCT
          question_chat.chat_id,
          question_chat.created_at
        FROM question_chat
        JOIN chat ON chat.id = question_chat.chat_id
        WHERE 
          chat.chat_id = $1
          AND question_chat.created_at BETWEEN $2 AND $3
      ),
      filtered_results AS (
        SELECT DISTINCT
          result.id AS result_id,
          result.is_correct,
          result.user_id
        FROM 
          result
        JOIN filtered_question_chat 
          ON filtered_question_chat.chat_id = result.chat_id
      ),
      filtered_users AS (
        SELECT DISTINCT
          user_chat.user_id
        FROM 
          user_chat
        JOIN chat ON chat.id = user_chat.chat_id
        WHERE 
          chat.chat_id = $1
      )
      SELECT 
        "user".id AS user_id,
        "user".name,
        "user".username,
        COUNT(CASE WHEN filtered_results.is_correct = true THEN 1 END) AS correctAnswers
      FROM 
        "user"
      LEFT JOIN filtered_results ON filtered_results.user_id = "user".id
      WHERE 
        "user".id IN (SELECT user_id FROM filtered_users)
      GROUP BY 
        "user".id, "user".name, "user".username, "user".streak
      ORDER BY correctAnswers DESC
      LIMIT 1;
    `;
    return await this.query(query, [chatId, startOfWeek, endOfWeek]);
  }

  async getUsersWithLeastCorrectAnswers(
    chatId: bigint,
    startOfWeek: Date,
    endOfWeek: Date,
  ) {
    const query = `
      WITH filtered_question_chat AS (
        SELECT DISTINCT
          question_chat.chat_id,
          question_chat.created_at
        FROM question_chat
        JOIN chat ON chat.id = question_chat.chat_id
        WHERE 
          chat.chat_id = $1
          AND question_chat.created_at BETWEEN $2 AND $3
      ),
      filtered_results AS (
        SELECT DISTINCT
          result.id AS result_id,
          result.is_correct,
          result.user_id
        FROM 
          result
        JOIN filtered_question_chat 
          ON filtered_question_chat.chat_id = result.chat_id
      ),
      filtered_users AS (
        SELECT DISTINCT
          user_chat.user_id
        FROM 
          user_chat
        JOIN chat ON chat.id = user_chat.chat_id
        WHERE 
          chat.chat_id = $1
      )
      SELECT 
        "user".id AS user_id,
        "user".name,
        "user".username,
        COUNT(CASE WHEN filtered_results.is_correct = false THEN 1 END) AS incorrectAnswers
      FROM 
        "user"
      LEFT JOIN filtered_results ON filtered_results.user_id = "user".id
      WHERE 
        "user".id IN (SELECT user_id FROM filtered_users)
      GROUP BY 
        "user".id, "user".name, "user".username, "user".streak
      ORDER BY incorrectAnswers ASC
      LIMIT 1;
    `;
    return await this.query(query, [chatId, startOfWeek, endOfWeek]);
  }
}
