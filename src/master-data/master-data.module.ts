import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityMaster } from './city-master.entity';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityMaster])],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
