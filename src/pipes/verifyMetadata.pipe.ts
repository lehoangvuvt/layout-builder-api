import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class VerifyMetadataPipe implements PipeTransform {
    transform(value: any, argumentMetadata: ArgumentMetadata) {
        const { metadata } = value
        if (metadata.trim().length === 0) throw new BadRequestException('Wrong metadata format')
        const parsedMetadata = JSON.parse(metadata) 
        return value
    }
}
