-- Adicionar policy para permitir usuários deletarem suas próprias conquistas
CREATE POLICY "Users can delete own achievements"
ON user_achievements
FOR DELETE
USING (auth.uid() = user_id);