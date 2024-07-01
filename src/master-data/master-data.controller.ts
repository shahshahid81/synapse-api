import { Controller, Get } from '@nestjs/common';
import { MasterDataType } from './master-data.types';
import { MasterDataService } from './master-data.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Master Data')
@Controller('master-data')
export class MasterDataController {
  constructor(private masterDataService: MasterDataService) {}

  @ApiBearerAuth()
  @Get('/city')
  async getCity(): Promise<MasterDataType> {
    return this.masterDataService.getCity();
  }
}
