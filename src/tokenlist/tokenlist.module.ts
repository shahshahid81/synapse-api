import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenList } from './token-list.entity';
import { TokenlistService } from './tokenlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenList])],
  providers: [TokenlistService],
  exports: [TokenlistService],
})
export class TokenlistModule {}
