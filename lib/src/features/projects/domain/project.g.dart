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
      mainImage:
          ImageAndPath.fromJson(json['mainImage'] as Map<String, dynamic>),
      id: json['id'] as String? ?? '',
      screenshots: (json['screenshots'] as List<dynamic>?)
              ?.map((e) => ImageAndPath.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const <ImageAndPath>[],
      technologies: (json['technologies'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <TechnologyID>[],
      featuresES: (json['featuresES'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      featuresEN: (json['featuresEN'] as List<dynamic>?)
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
      'mainImage': instance.mainImage.toJson(),
      'id': instance.id,
      'screenshots': instance.screenshots.map((e) => e.toJson()).toList(),
      'technologies': instance.technologies,
      'featuresES': instance.featuresES,
      'featuresEN': instance.featuresEN,
      'websiteUrl': instance.websiteUrl,
      'sourceCodeUrl': instance.sourceCodeUrl,
    };
