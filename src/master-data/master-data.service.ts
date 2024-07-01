import { Injectable } from '@nestjs/common';
import { MasterDataType } from './master-data.types';
import { CityMaster } from './city-master.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(CityMaster)
    private cityMasterRepository: Repository<CityMaster>,
  ) {}

  async getCity(): Promise<MasterDataType> {
    return this.cityMasterRepository.find({
      select: {
        label: true,
        value: true,
      },
    });
  }
}
