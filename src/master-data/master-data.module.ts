import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityMaster } from './city-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityMaster])],
})
export class MasterDataModule {}
