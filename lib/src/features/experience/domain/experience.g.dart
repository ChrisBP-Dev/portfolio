// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'experience.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ExperienceImpl _$$ExperienceImplFromJson(Map<String, dynamic> json) =>
    _$ExperienceImpl(
      id: json['id'] as String,
      date: json['date'] as String,
      companyName: json['companyName'] as String,
      jobNameEn: json['jobNameEn'] as String,
      jobNameEs: json['jobNameEs'] as String,
      responsabilitiesEn: (json['responsabilitiesEn'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      responsabilitiesEs: (json['responsabilitiesEs'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$$ExperienceImplToJson(_$ExperienceImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date,
      'companyName': instance.companyName,
      'jobNameEn': instance.jobNameEn,
      'jobNameEs': instance.jobNameEs,
      'responsabilitiesEn': instance.responsabilitiesEn,
      'responsabilitiesEs': instance.responsabilitiesEs,
    };
