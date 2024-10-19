// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProjectImpl _$$ProjectImplFromJson(Map<String, dynamic> json) =>
    _$ProjectImpl(
      id: json['id'] as String,
      companyNameEs: json['companyNameEs'] as String,
      companyNameEn: json['companyNameEn'] as String,
      shortDescriptionEs: json['shortDescriptionEs'] as String,
      shortDescriptionEn: json['shortDescriptionEn'] as String,
      technologies: (json['technologies'] as List<dynamic>)
          .map((e) => Technology.fromJson(e as Map<String, dynamic>))
          .toList(),
      featuresEs: (json['featuresEs'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      featuresEn: (json['featuresEn'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      myContributionsEs: (json['myContributionsEs'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      myContributionsEn: (json['myContributionsEn'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      mainImageUrl: json['mainImageUrl'] as String,
      imagesUrls: (json['imagesUrls'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      websiteUrl: json['websiteUrl'] as String?,
      sourceCodeUrl: json['sourceCodeUrl'] as String?,
    );

Map<String, dynamic> _$$ProjectImplToJson(_$ProjectImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'companyNameEs': instance.companyNameEs,
      'companyNameEn': instance.companyNameEn,
      'shortDescriptionEs': instance.shortDescriptionEs,
      'shortDescriptionEn': instance.shortDescriptionEn,
      'technologies': instance.technologies,
      'featuresEs': instance.featuresEs,
      'featuresEn': instance.featuresEn,
      'myContributionsEs': instance.myContributionsEs,
      'myContributionsEn': instance.myContributionsEn,
      'mainImageUrl': instance.mainImageUrl,
      'imagesUrls': instance.imagesUrls,
      'websiteUrl': instance.websiteUrl,
      'sourceCodeUrl': instance.sourceCodeUrl,
    };
