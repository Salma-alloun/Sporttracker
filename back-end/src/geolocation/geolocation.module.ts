import { Module } from '@nestjs/common';
import { GeolocationGateway } from './geolocation.gateway';

@Module({
  providers: [GeolocationGateway],
  exports: [GeolocationGateway],
})
export class GeolocationModule {}