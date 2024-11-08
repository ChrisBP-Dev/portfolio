// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProjectImpl _$$ProjectImplFromJson(Map<String, dynamic> json) =>
    _$ProjectImpl(
      companyNameEs: json['companyNameEs'] as String,
      companyNameEn: json['companyNameEn'] as String,
      shortDescriptionEs: json['shortDescriptionEs'] as String,
      shortDescriptionEn: json['shortDescriptionEn'] as String,
      mainImageUrl: json['mainImageUrl'] as String,
      refMainImage: json['refMainImage'] as String?,
      id: json['id'] as String? ?? '',
      imagesUrls: (json['imagesUrls'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      refImagesUrls: (json['refImagesUrls'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      technologies: (json['technologies'] as List<dynamic>?)
              ?.map((e) => Technology.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const <Technology>[],
      featuresEs: (json['featuresEs'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      featuresEn: (json['featuresEn'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      websiteUrl: json['websiteUrl'] as String?,
      sourceCodeUrl: json['sourceCodeUrl'] as String?,
    );

Map<String, dynamic> _$$ProjectImplToJson(_$ProjectImpl instance) =>
    <String, dynamic>{
      'companyNameEs': instance.companyNameEs,
      'companyNameEn': instance.companyNameEn,
      'shortDescriptionEs': instance.shortDescriptionEs,
      'shortDescriptionEn': instance.shortDescriptionEn,
      'mainImageUrl': instance.mainImageUrl,
      'refMainImage': instance.refMainImage,
      'id': instance.id,
      'imagesUrls': instance.imagesUrls,
      'refImagesUrls': instance.refImagesUrls,
      'technologies': instance.technologies,
      'featuresEs': instance.featuresEs,
      'featuresEn': instance.featuresEn,
      'websiteUrl': instance.websiteUrl,
      'sourceCodeUrl': instance.sourceCodeUrl,
    };
